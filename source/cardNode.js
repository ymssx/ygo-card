import { createCanvas, loadImage, registerFont } from 'canvas';
import nodeConfig from './config/nodeConfig.js';
import { variation, transType } from "./lib/variation.js";
import CardData from './cardData.js';
import CardDrawer from './cardDrawer.js';
import defaultCopyright from './lib/copyright.js';

export class CardFile {
  constructor(admin) {
    this.admin = admin;
    this.loadFonts();
  }

  getFileList() {
    let data = this.admin.data;
    let path = this.admin.moldPath;

    let res= {};
    if (data.type === 'monster') {
        if (data.type3 !== 'lb') {
          res.mold = path + 'frame/' + data.type + '_' + data.type2 + '.jpg';
        } else {
          res.mold = path + 'frame/' + data.type + '_' + data.type2 + '_' + 'lb' + '.jpg';
        }

        if (data.type2 === 'lj') {
          res.arrow1_0 = path + 'arrow/arrow1_0.png';
          res.arrow1_1 = path + 'arrow/arrow1_1.png';
          res.arrow2_0 = path + 'arrow/arrow2_0.png';
          res.arrow2_1 = path + 'arrow/arrow2_1.png';
        }

        res.attribute = `${path}attribute/${data.lang}/${data.attribute}.png`;
        if (data.type2 === 'cl') {
          res.level = path + 'star/rank.png';
        } else {
          res.level = path + 'star/level.png';
        }
    } else {
      res.mold = path + 'frame/' + data.type + '.jpg';
      res.attribute = `${path}attribute/${data.lang}/${data.type}.png`;;
      if (data.type2 !== 'tc') {
        res.icon = path + 'icon/' + data.type2 + '.png';
      }
    }

    if (this.admin.holo) {
      res.holo = path + 'holo/holo.png';
      res.holo_flash = path + 'holo/holo.jpg';
    }

    res.pic = this.admin.picPath;
  
    return res;
  }


  getFileContent() {
    let fileList = this.getFileList();
    const path = this.admin.moldPath;
    this.fileContent = {};
    let filePromise = [];
  
    for (let file in fileList) {
      let url = fileList[file];
      filePromise.push(loadImage(url).then((image) => {
        this.fileContent[file] = image;
      }).catch((e) => {
        console.error(`cannot load image ${url} because of error: [${e.message}], use default image instead.`);
        return loadImage(`${path}pic.jpg`).then(image => {
          this.fileContent[file] = image;
        });
      }))
    }
  
    return Promise.all(filePromise);
  }


  loadFonts() {
    let fontMap = this.admin.config.fonts;
    for (let fontName in fontMap) {
      let fontIfm = fontMap[fontName];
      registerFont(this.admin.moldPath + 'font/' + fontIfm.name, { family: fontName })
    }
  }


  loadAll() {
    return this.getFileContent();
  }
}


export class Card {
  constructor({
    data,
    size = 813,
    config = nodeConfig,
    picPath,
    moldPath = './mold/',
    lang = 'cn',
    copyright = defaultCopyright.jp,
    cardbagSwitch = false,
    passwordSwitch = true,
    holo = true,
    translate = false,
  }) {
    this.size = [size, size * 1185 / 813];
    this.config = config;
    this.moldPath = moldPath;
    this.picPath = picPath;

    this.lang = lang;
    this.copyright = copyright;
    this.cardbagSwitch = cardbagSwitch;
    this.passwordSwitch = passwordSwitch;
    this.holo = holo;

    this.translate = translate;

    this.data = new CardData(data, this);
    this.cardFile = new CardFile(this);
    this.canvas = createCanvas(this.size[0], this.size[1]);
    this.cardDrawer = new CardDrawer(this);
  }


  async render() {
    await this.cardFile.loadAll();
    this.cardDrawer.draw(this.data, this.cardFile.fileContent);
    return this.canvas;
  }
  
  static transData(data) {
    return variation(data);
  }  

  static complex(text) {
    return translate(text);
  }

  static readYDK(text) {
    let temp = text.split('#main')[1].split('#extra');
    let mainText = temp[0].trim();
    let temp2 = temp[1].split('!side');
    let exText = temp2[0].trim();
    let sideText = temp2[1].trim();

    let main = mainText.split('\n');
    let ex = exText.split('\n');
    let side = sideText.split('\n');
    return [main, ex, side];
  }
}
