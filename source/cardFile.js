export class CardFile {
  constructor(admin) {
    this.admin = admin;
    this.fileContent = {};

    if (!window.fontMap) {
      let fontBox = document.createElement('div');
      fontBox.style.width = '0';
      fontBox.style.height = '0';
      fontBox.style.overflow = 'hidden';
      document.body.appendChild(fontBox);      
      window.fontMap = {
        fontBox
      };
    }

    for (let fontName in this.admin.config.fonts) {
      if (!window.fontMap.hasOwnProperty(fontName)) {
        window.fontMap[fontName] = false;
      }
    }

    this.loadAll();
  }

  log(...content) {
    this.admin.log(this, ...content);
  }

  draw() {
    this.admin.draw();
  }

  async loadAll() {
    this.fileContent = await this.getFiles(this.fileList);
    await this.loadFonts(this.admin.config.fonts);
    return true;
  }

  async update(keys, who) {
    if (keys) {
      for (let key of keys) {
        let fileUrl;
        let save = true;

        if (key === 'pic') {
          fileUrl = this.admin.config["pic"](this.data._id);
          save = false;
        } else {
          fileUrl = this.fileList[key];
        }

        if (fileUrl) {
          this.fileContent[key] = await this.getFile(fileUrl, save);
        }
      }
    }

    this.draw();
  }

  get fileList() {
    const path = this.admin.moldPath + '/';
    const data = this.admin.data;

    let res= {};
    if (data.type === 'monster') {
        if (data.type3 !== 'lb') {
          res.mold = path + data.type + '_' + data.type2 + '.jpg';
        } else {
          res.mold = path + data.type + '_' + data.type2 + '_' + 'lb' + '.jpg';
        }

        if (data.type2 === 'lj') {
          res.arrow1_0 = path + 'arrow1_0.png';
          res.arrow1_1 = path + 'arrow1_1.png';
          res.arrow2_0 = path + 'arrow2_0.png';
          res.arrow2_1 = path + 'arrow2_1.png';
        }

        res.attribute = path + 'attribute/' + data.attribute + '.png';
        if (data.type2 === 'cl') {
          res.level = path + 'level.png';
        } else {
          res.level = path + 'star.png';
        }
    } else {
      res.mold = path + data.type + '.jpg';
      res.attribute = path + 'attribute/' + data.type + '.png';
      if (data.type2 !== 'tc') {
        res.icon = path + 'type/' + data.type2 + '.png';
      }
    }

    if (this.admin.holo) {
      res.holo = path + 'holo.png';
      res.holo_flash = path + 'holo.jpg';
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
  
  async getFiles(files) {
    let res = {};
    for (let key in files) {
      res[key] = await this.getFile(files[key]);
    }

    let url = this.admin.config["pic"](this.admin.data._id);
    res.pic = await this.getFile(url, false);

    return res;
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
    if (window.fontMap[name]) return;

    var css = document.createElement('style');
    css.setAttribute('type', 'text/css');
    css.setAttribute("crossOrigin",'anonymous');
    css.setAttribute('class', name);
    let data = "\n@font-face {font-family: '"+ name +"';src: url('"+ url +"');}\n";
    css.appendChild(document.createTextNode(data));
    document.head.appendChild(css);
    
    let p = document.createElement('p');
    p.innerText = 'Yami';
    p.style.fontFamily = name;
    window.fontMap.fontBox.appendChild(p);

    return await fetch(url);
  }
  
  async loadFonts(fonts) {
    for (let fontName in fonts) {
      if (!window.fontMap[fontName]) {
        let path;
        if (fonts[fontName]['type'] === 'relative') {
          path = this.admin.moldPath + '/font/' + fonts[fontName]['name'];
        } else {
          path = fonts[fontName]['name'];
        }

        await this.loadFont(path, fontName);

        window.fontMap[fontName] = true;

        this.admin.fontLoaded({
          type: 'font',
          status: true,
          content: fontName
        });
      }
    }

    this.draw();

    this.admin.fontsLoaded({
      type: 'end'
    });
  }
}