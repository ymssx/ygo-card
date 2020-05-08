import {CardDrawer} from "./cardDrawer.js";
import {CardData} from "./cardData.js";
import {CardFile} from "./cardFile.js";
import Variation from "./lib/variation.js";
import {translate} from "./lib/translate.js";
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
  RATE = 1185 / 813;
  constructor({
    data, canvas,
    size,
    moldPath = './mold',
    lang = 'cn',
    config = defaultConfig,
    fontLoaded = defaultEvent,
    imageLoaded = defaultEvent,
    fontsLoaded = defaultEvent,
    imagesLoaded = defaultEvent,
    loaded = defaultEvent,
    recover = false,
    holo = true,
    cardbagSwitch = false,
    translate = true,
    verbose = false,
    autoResize = true
  }) {    
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
    this.moldPath = moldPath;

    // events register
    this.fontLoaded = fontLoaded;
    this.imageLoaded = imageLoaded;
    this.fontsLoaded = fontsLoaded;
    this.imagesLoaded = imagesLoaded;
    this.loaded = loaded;

    this.lang = lang;
    this.imgStatus = false;
    this.db_id = null;
    this.flashImg = null;
    this.holo = holo;
    this.cardbagSwitch = cardbagSwitch;
    this.translate = translate;
    this.verbose = verbose;
    this.autoResize = autoResize;
    this.renderState = false;

    this.data = new CardData(data, this);
    
    if (canvas) {
      this.bind(canvas, size);
    }
  }

  log(origin, ...content) {
    if (this.verbose) {
      console.log(...content);
    }
  }

  bind(canvas, size) {
    this.canvas = canvas;

    if (size) {
      canvas.style.maxWidth = size[0] + 'px';
      canvas.style.maxHeight = size[1] + 'px';
      this.size = [size[0] * 2, size[1] * 2];
    } else {
      this.size = this.ansysSize();
      if (this.autoResize) {
        // 当canvas实际尺寸发生变化时，提交一个canvas重绘的异步请求
        this.sizeObserver = new ResizeObserver(() => {
          this.resize();
        });
        this.sizeObserver.observe(this.canvas);
        /*
        重绘函数中会调整canvas尺寸，这会再次引起ResizeObserver的回调，从而无限迭代
        使用MutationObserver监听canvas尺寸的变化，清空重绘的事件队列，切断迭代
        */
        this.attriObserver = new MutationObserver(() => {
          if (this.resizer) {
            clearTimeout(this.resizer);
            this.resizer = null;
          }
        });
        this.attriObserver.observe(this.canvas, {
          attributes : true,
          attributeFilter : ['width', 'height']
        });
      }
    }
    
    this.cardDrawer = new CardDrawer(canvas, this);
    this.cardFile = new CardFile(this);
  }

  async render() {
    await this.cardFile.loadAll();
    this.renderState = true;
    this.draw();
    return true;
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

  draw(size, config) {
    if (this.renderState) {
      return new Promise(resolve => {
        this.cardDrawer.draw(this.data, this.cardFile.fileContent, size, config, () => {
          resolve();
        });
      })
    }
  }

  async save(saveName, size = [1626, 2370]) {
    let [w ,h] = [this.canvas.width, this.canvas.height];
    await this.draw(size);

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

  ansysSize(thre = 0.0001) {
    let w = 2 * this.canvas.clientWidth;
    let h = 2 * this.canvas.clientHeight;
    let currentRate = h / w;
    if (currentRate - this.RATE > thre) {
      h = w * this.RATE;
    } else if (this.RATE - currentRate > thre) {
      w = h / this.RATE;
    }

    return [w, h];
  }

  resize(delay = 500) {
    if (this.resizer) {
      clearTimeout(this.resizer);
    }

    this.resizer = setTimeout(() => {
      this._resize_();
    }, delay);
  }

  _resize_() {
    this.size = this.ansysSize();
    this.draw(this.size);
  }

  static transData(data) {
    return Variation(data);
  }

  static complex(text) {
    return translate(text);
  }
}