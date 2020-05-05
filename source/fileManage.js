import {CardDrawer} from "./cardDrawer.js";
import {bounce} from "./lib/bounce.js";
import {Cloud} from "./lib/ajax.js";

export const FileManage = function (cardData, cardDrawer, admin) {
  this.admin = admin;
  cardData.caller = this;
  this.cardData = cardData;
  this.cardDrawer = cardDrawer;

  this.fileContent = {};
  this.bounce = this.bounceFont(100);
  this.refresh();

  // if (!this.admin.fastFont) {
  //   this.loadFullFont(this.admin.config.font.text);
  // }
  if (!window.fontMap) window.fontMap = {}
  for (let fontName in this.admin.config.fonts) {
    if (!window.fontMap.hasOwnProperty(fontName)) {
      window.fontMap[fontName] = false;
    }
  }

  this.loadFonts(this.admin.config.fonts);
};

FileManage.prototype = {
  log(...content) {
    this.admin.log(this, ...content);
  },
  async refresh() {
    this.fileContent = await this.getFiles(this.fileList);
    // await this.bounce(this.cardData.name + this.cardData.desc + this.cardData._ifm_cn);
    setTimeout(() => {
      if (this.cardDrawer instanceof CardDrawer) {
        this.cardDrawer.draw(this.cardData, this.fileContent);
      }
    }, 200)
  },
  async update(keys, who) {
    let delay = 0;
    if (keys) {
      for (let key of keys) {
        let fileUrl;
        let save = true;
        if (key === 'pic') {
          fileUrl = this.admin.config["pic"](this.cardData._id);
          save = false;
        } else if (key === 'text' && this.admin.fastFont) {
          await this.bounce(this.cardData.name + this.cardData.desc + this.cardData._ifm_cn);
          delay = 200;
        } else {
          fileUrl = this.fileList[key];
        }
        if (fileUrl) {
          this.fileContent[key] = await this.getFile(fileUrl, save);
        }
      }
    }
    if (this.cardDrawer instanceof CardDrawer) {
      if (delay) {
        await setTimeout(() => {
            this.cardDrawer.draw(this.cardData, this.fileContent);
            return true;
        }, delay)
      } else {
        this.cardDrawer.draw(this.cardData, this.fileContent);
        return true;
      }
    }
  },
  get fileList() {
    const path = this.admin.moldPath + '/';
    let res= {};
    if (this.cardData.type === 'monster') {
        if (this.cardData.type3 !== 'lb') {
          res.mold = path + this.cardData.type + '_' + this.cardData.type2 + '.jpg';
        } else {
          res.mold = path + this.cardData.type + '_' + this.cardData.type2 + '_' + 'lb' + '.jpg';
        }

        if (this.cardData.type2 === 'lj') {
          res.arrow1_0 = path + 'arrow1_0.png';
          res.arrow1_1 = path + 'arrow1_1.png';
          res.arrow2_0 = path + 'arrow2_0.png';
          res.arrow2_1 = path + 'arrow2_1.png';
        }

        res.attribute = path + 'attribute/' + this.cardData.attribute + '.png';
        if (this.cardData.type2 === 'cl') {
          res.level = path + 'level.png';
        } else {
          res.level = path + 'star.png';
        }
    } else {
      res.mold = path + this.cardData.type + '.jpg';
      res.attribute = path + 'attribute/' + this.cardData.type + '.png';
      if (this.cardData.type2 !== 'tc') {
        res.icon = path + 'type/' + this.cardData.type2 + '.png';
      }
    }

    if (this.admin.holo) {
      res.holo = path + 'holo.png';
      res.holo_flash = path + 'holo.jpg';
    }

    return res;
  },
  async fileExist(name) {
    return new Promise((resolve, reject) => {
      let res = localStorage.getItem(name);
      if (res) {
        this.log(name, 'load localstorage');
        let img = document.createElement('img');
        img.src = res;
        img.setAttribute("crossOrigin",'anonymous');
        img.onload = function() {
          resolve(img);
        }
        img.onerror = function(err) {
          reject(err);
        }
      } else {
        resolve(false);
      }
    })
  },
  download(file) {
    return new Promise(((resolve, reject) => {
      let img = document.createElement('img');
      img.src = file;
      img.setAttribute("crossOrigin",'anonymous');
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function (err) {
        reject(err);
      }
    }))
  },
  async getFile(file, save = true) {
    let fileContent = await this.fileExist(file);
    if (!fileContent) {
      fileContent = await this.download(file);
      if (save) {
        this.saveImage(file, fileContent);
      }
    }
    return fileContent;
  },
  async getFiles(files) {
    let res = {};
    for (let key in files) {
      res[key] = await this.getFile(files[key]);
    }
    try {
      let url;
      if (this.cardData.getData().img) {
        url = '/img/diypic?_id=' + this.admin.db_id;
      } else {
        url = this.admin.config["pic"](this.cardData._id);
      }
      res.pic = await this.getFile(url, false);
    } catch(err) {
      console.error(err);
    }
    return res;
  },
  saveImage(key, image) {
    let canvas = document.createElement("canvas");
    let c = canvas.getContext("2d");

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    c.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

    let data = canvas.toDataURL("image/png");
    try {
      localStorage.setItem(key, data);
      this.log(key, 'successful save the image');
    }
    catch (e) {
      this.log("Storage failed: " + e);
    }
  },
  async getFont(text) {
    let font = await this.fontLoader.getPart(text);
    this.fontLoader.register(font, 'cn' + this.admin.key);
    return font;
  },
  bounceFont(time) {
    return bounce(async (text) => {
      return await this.getFont(text);
    }, time);
  },
  async loadFullFont(url) {
    var font = await this.fontLoader.getFull(url);
    this.fontLoader.register(font, 'cn');
    setTimeout(() => {
      if (this.cardDrawer instanceof CardDrawer) {
        this.cardDrawer.draw(this.cardData, this.fileContent);
      }
    }, 200)
  },
  async loadFonts(fonts) {
    const fontLoader = new FontLoader();

    for (let fontName in fonts) {
      if (!window.fontMap[fontName]) {
        let path;
        if (fonts[fontName]['type'] === 'relative') {
          path = this.admin.moldPath + '/font/' + fonts[fontName]['name'];
        } else {
          path = fonts[fontName]['name'];
        }

        await fontLoader.getFull(path, fontName);

        setTimeout(() => {
          if (this.cardDrawer instanceof CardDrawer) {
            window.fontMap[fontName] = true;
            this.cardDrawer.draw(this.cardData, this.fileContent);
          }
        }, 200);

        this.admin.fontLoaded({
          type: 'font',
          status: true,
          content: fontName
        });
      }
    }

    this.admin.fontsLoaded({
      type: 'end'
    });
  }
};


export const FontLoader = function () {
  // this.url = url;
  // this.fonts = [];
  // this.p = document.createElement('p');
  // this.p.innerText = 'Yami';
  // this.p.style.fontFamily = '';
  // this.p.style.opacity = 0;
  // this.p.style.position = 'fixed';
  // this.p.style.height = '100px';
  // this.p.style.fontFamily = '100px';
  // this.p.style.top = '-100px';
  // this.p.style.left = '-100px';
  //document.body.appendChild(this.p);
}

FontLoader.prototype = {
  async getFull(url, name) {
    if (window.fontMap[name]) return;

    var css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    css.setAttribute("crossOrigin",'anonymous');
    css.setAttribute('class', name);
    let data = "\n@font-face {font-family: '"+ name +"';src: url('"+ url +"');}\n";
    css.appendChild(document.createTextNode(data));
    document.head.appendChild(css);

    return await Cloud({ path: url });
  },
  async getPart(text) {
    text = text.replace('\n','').replace('\r','').replace('?','').replace('=','').replace('&','');
    return await Cloud({ path: this.url + '?wd=' + text });
  }
};
