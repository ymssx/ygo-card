import {CardDrawer} from "./cardDrawer.js";
import {CardData} from "./cardData.js";
import {CardFile} from "./cardFile.js";
import defaultConfig from "./config/defaultConfig.js";

let defaultEvent = function (e) {
  return e;
};

/*
- data: card information

  interface data = {
    name: string,                          // card name
    _id: string,                           // card id
    type: 'monster' | 'magic' | 'tragic',  // first type
    type2: type,                           // secend type
    type3: type,                           // third type
    type4: type,                           // fourth type
    desc: string                           // card describe
    ?attribute: 'light' | 'dark' | 'fire' | 'water' | 'wind' | 'ground' | 'god'
                                           // monster attribute
    ?race: string                          // monster race
    ?attack: number                        // monster attack
    ?defend: number                        // monster defend
    ?level: number                         // monster level

    ?link: boolean[]                       // link monster arrows
    ?lb_desc: string                       // pendulum describe
    ?lb_number: number                     // pendulum number
  }

  typeMap = { "tc": '通常', "xg": '效果', "ys": '儀式', "rh": '融合', "tt": '同調', "cl": '超量', "lb": '靈擺', "lj": '連接', "ec": '二重', "tz": '調整', "tm": '同盟', "tk": '卡通', "lh": '靈魂', "fz": '反轉', "ts": '特殊召喚', "zb": '裝備', "sg": '速攻', "cd": '場地', "fj": '反擊', "yx": '永續' }


- canvas: HTMLElement
*/

export default class Card {
  constructor({
    data, canvas,
    size = [813, 1185],
    lang = 'cn',
    config = defaultConfig,
    fastFont = true,
    fontLoaded = defaultEvent,
    imageLoaded = defaultEvent,
    fontsLoaded = defaultEvent,
    imagesLoaded = defaultEvent,
    loaded = defaultEvent,
    recover = false,
    holo = true,
    cardbagSwitch = false,
    translate = true,
    verbose = false
  }) {
    // current path
    let moldPath = import.meta.url.split('/');
    if (moldPath.length > 1) {
      moldPath[moldPath.length - 1] = 'mold';
      this.moldPath = moldPath.join('/');
    } else {
      this.moldPath = '/';
    }
    
    // recover config from localStorage
    this.recover = recover;
    if (recover) {
      var tempConfig = Object.create(config);
      for (let key in config) {
        if (localStorage.getItem(key)) {
          tempConfig[key] = JSON.parse(localStorage.getItem(key))
        }
      }
    }

    this.config = tempConfig || config;
    this.key = data._id;
    this.fastFont = fastFont;

    // events register
    this.fontLoaded = fontLoaded;
    this.imageLoaded = imageLoaded;
    this.fontsLoaded = fontsLoaded;
    this.imagesLoaded = imagesLoaded;
    this.loaded = loaded;

    size = [size[0]*2, size[1]*2];
    this.size = size;

    this.lang = lang;
    this.imgStatus = false;
    this.db_id = null;
    this.flashImg = null;
    this.holo = holo;
    this.cardbagSwitch = cardbagSwitch;
    this.translate = translate;
    this.verbose = verbose;
    this.renderState = false;

    this.data = new CardData(data, this);
    if (canvas) {
      canvas.style.maxWidth = 0.5 * size[0] + 'px';
      canvas.style.maxHeight = 0.5 * size[1] + 'px';
      canvas.width = size[0];
      canvas.height = size[1];
      this.canvas = canvas;
      this.cardDrawer = new CardDrawer(canvas, this);
      this.cardFile = new CardFile(this);
    }
  }

  log(origin, ...content) {
    if (this.verbose) {
      console.log(...content);
    }
  }

  bind(canvas) {
    this.canvas = canvas;
    canvas.width = this.size[0];
    canvas.height = this.size[1];
    this.cardDrawer = new CardDrawer(canvas, this);
    this.cardFile = new CardFile(this);
  }

  async render() {
    await this.cardFile.loadAll();
    this.renderState = true;
    this.draw();
    return true;
  }

  get promise() {
    return new Promise((resolve, reject) => {
      this.rendered = () => {
        let renderedEvent = {
          type: 'draw',
          status: true,
          content: 'ok'
        };
        
        this.loaded(renderedEvent);
        resolve(renderedEvent);
      };
  
      this.failed = reject;
    });
  }

  feed(img, imgStatus = false) {
    this.cardFile.fileContent.pic = img;
    this.imgStatus = imgStatus;
    this.draw();
  }

  changeConfig(config) {
    this.config = config;
    this.draw();
  }

  draw() {
    if (this.renderState) {
      this.cardDrawer.draw(this.data, this.cardFile.fileContent);
    }
  }

  save(saveName, size = [1626, 2370]) {
    let [w ,h] = [this.canvas.width, this.canvas.height];
    this.canvas.width = size[0];
    this.canvas.height = size[1];
    this.cardDrawer.draw(this.data, this.cardFile.fileContent, size);

    let dataURI = this.canvas.toDataURL('image/png');

    var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    let blob = new Blob([arr]);

    var objurl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = saveName || this.data.name + '.png';
    link.href = objurl;
    link.click();


    this.canvas.width = w;
    this.canvas.height = h;
    this.draw();
  }

  autoDraw() {
    setInterval(() => {
      this.draw();
    },200)
  }

  feedData(data) {
    for (let key in data) {
      this.data[key] = data[key];
    }
  }

  get getData() {
    return this.data.getData();
  }

  saveToCache() {
    this.data.saveToCache();

    for (let key in this.config) {
      let json = JSON.stringify(this.config[key]);
      localStorage.setItem(key, json);
    }

    localStorage.setItem('lang', this.lang);
  }

  feedFlash(img) {
    this.flashImg = img;
    this.data.flash = 0;
  }
}