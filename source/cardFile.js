import { Cloud } from './lib/ajax.js';

const YGOCARDDATA = '__YGOCARDDATA__';

export default class CardFile {
  constructor(admin) {
    this.admin = admin;
    this.fileContent = {};
    this.updateMap = new Set();
    this.updateCaller = null;

    if (!window[YGOCARDDATA].cardPicCache) window[YGOCARDDATA].cardPicCache = {};

    if (!window[YGOCARDDATA].fontMap) {
      let fontBox = document.createElement('div');
      fontBox.style.width = '0';
      fontBox.style.height = '0';
      fontBox.style.overflow = 'hidden';
      document.body.appendChild(fontBox);      
      window[YGOCARDDATA].fontMap = {
        fontBox
      };
    }
  }

  log(...content) {
    this.admin.log(this, ...content);
  }

  draw(...arg) {
    this.admin.draw(...arg);
  }

  async loadAll() {
    this.fileContent = await this.getFiles(this.fileList);
    this.admin.renderState = true;
    this.draw();

    this.loadCardPic().then(() => {
      this.draw();
    });
    
    await this.loadFonts(this.admin.config.fonts).then(() => {
      setTimeout(() => {
        this.draw();
      }, 1000)
    });
    return true;
  }

  async update(keys, who) {
    if (Array.isArray(keys)) {
      keys.forEach(key => this.updateMap.add(key));
    }
    
    window.cancelAnimationFrame(this.updateCaller);
    this.updateCaller = window.requestAnimationFrame(() => this._update_());
  }

  async _update_() {
    const keys = Array.from(this.updateMap.values());
    const taskList = [];

    if (keys) {
      for (let key of keys) {
        let fileUrl;

        if (key === 'pic') {
          taskList.push(this.loadCardPic());
        } else {
          fileUrl = this.fileList[key];
          if (fileUrl) {
            taskList.push((async () => {
              this.fileContent[key] = await this.getFile(fileUrl);
              return true;
            })());
          }
        }
      }
    }

    await Promise.all(taskList);

    this.updateMap.clear();
    this.draw();
    return true;
  }

  get fileList() {
    const path = this.admin.moldPath + '/';
    const data = this.admin.data;

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

        res.attribute = path + 'attribute/' + data.attribute + '.png';
        if (data.type2 === 'cl') {
          res.level = path + 'star/rank.png';
        } else {
          res.level = path + 'star/level.png';
        }
    } else {
      res.mold = path + 'frame/' + data.type + '.jpg';
      res.attribute = path + 'attribute/' + data.type + '.png';
      if (['cd', 'fj', 'sg', 'ys', 'yx', 'zb'].includes(data.type2)) {
        res.icon = path + 'icon/' + data.type2 + '.png';
      }
    }

    if (this.admin.holo) {
      res.holo = path + 'holo/holo.png';
      res.holo_flash = path + 'holo/holo.jpg';
    }

    return res;
  }

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
  }

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
  }
  
  async getFile(file, save = true) {
    let fileContent = await this.fileExist(file);
    if (!fileContent) {
      fileContent = await this.download(file);
      if (save) {
        this.saveImage(file, fileContent);
      }
    }
    return fileContent;
  }

  getCorsPic(url) {
    return Cloud({
      method: 'GET',
      path: url,
      responseType: 'blob',
    }).then(blob => {
      let base64 = URL.createObjectURL(blob);
      return this.download(base64);
    }).catch(e => console.log(e));
  }
  
  async getFiles(files) {
    let res = {};
    for (let key in files) {
      res[key] = await this.getFile(files[key]);
    }

    return res;
  }

  async loadCardPic() {
    let url = this.admin.getPic(this.admin.data._id);
    const cardPicCache = window[YGOCARDDATA].cardPicCache;
    if (cardPicCache.hasOwnProperty(url)) {
      let res = cardPicCache[url];
      if (res instanceof Promise) {
        await res.then(pic => {
          this.fileContent.pic = pic;
        })
      } else {
        this.fileContent.pic = res;
      }
    } else {
      cardPicCache[url] = new Promise(resolve => {
        this.getCorsPic(url)
          .then(pic => {
            this.fileContent.pic = pic;
            cardPicCache[url] = pic;
          })
          .finally(() => {
            resolve();
          });
      })

      await cardPicCache[url];
    }
     
    return true;
  }
  
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
  }

  async loadFont(url, name) {
    if (window[YGOCARDDATA].fontMap[name] === 1) {
      var css = document.createElement('style');
      css.setAttribute('type', 'text/css');
      css.setAttribute("crossOrigin",'anonymous');
      css.setAttribute('class', name);
      let data = `
      @font-face {
        font-family: '`+ name +`';
        src: url('`+ url +`');
      }`;
      css.appendChild(document.createTextNode(data));
      document.head.appendChild(css);
      
      let p = document.createElement('p');
      p.innerText = 'Yami';
      p.style.fontFamily = name;
      window[YGOCARDDATA].fontMap.fontBox.appendChild(p);

      window[YGOCARDDATA].fontMap[name] = 2;
  
      let font = await Cloud({
        method: 'GET',
        path: url
      });

      window[YGOCARDDATA].fontMap[name] = 3;
      return font;
    } else if (window[YGOCARDDATA].fontMap[name] === 2) {  
        let font = await Cloud({
          method: 'GET',
          path: url
        });

        window[YGOCARDDATA].fontMap[name] = 3;
        return font;
    }
  }
  
  loadFonts(fonts) {
    for (let fontName in this.admin.config.fonts) {
      if (!window[YGOCARDDATA].fontMap.hasOwnProperty(fontName)) {
        window[YGOCARDDATA].fontMap[fontName] = 1;
      }
    }
    
    let fontslist = [];
    for (let fontName in fonts) {
      if (window[YGOCARDDATA].fontMap[fontName] !== 3) {
        let path;
        if (fonts[fontName]['type'] === 'relative') {
          path = this.admin.moldPath + '/font/' + fonts[fontName]['name'];
        } else {
          path = fonts[fontName]['name'];
        }

        this.admin.fontLoaded({
          type: 'font',
          status: true,
          content: fontName
        });

        fontslist.push(this.loadFont(path, fontName));
      }
    }

    return Promise.all(fontslist).then(() => {
      this.admin.fontsLoaded({
        type: 'end'
      });
    })
  }
}