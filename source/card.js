import CardDrawer from "./cardDrawer.js";
import CardData from "./cardData.js";
import CardFile from "./cardFile.js";
import { variation, transType } from "./lib/variation.js";
import { translate } from "./lib/translate.js";
import { readYDK } from "./lib/readYDK.js";
import { getPicFromCose } from "./lib/getPic.js";

// configs
import defaultConfig from "./config/defaultConfig.js";
import cnSimplifyConfig from "./config/cnSimplifyConfig.js";
import defaultJpConfig from './config/defaultJpConfig.js';
import jpWitchNotationConfig from './config/jpWithNotationConfig.js';
import defaultEnConfig from './config/defaultEnConfig.js';

const defaultEvent = () => null;

export class Card {
  constructor({
    data,
    canvas,
    size,
    moldPath = "./mold",
    lang = "cn",
    config = defaultConfig,
    getPic = getPicFromCose,
    fontLoaded = defaultEvent,
    imageLoaded = defaultEvent,
    fontsLoaded = defaultEvent,
    imagesLoaded = defaultEvent,
    picLoaded = defaultEvent,
    loaded = defaultEvent,
    recover = false,
    holo = true,
    cardbagSwitch = false,
    passwordSwitch = false,
    translate = false,
    verbose = false,
    autoResize = true,
  }) {
    this.RATE = 1185 / 813;
    if (!window.hasOwnProperty("__YGOCARDDATA__"))
      window["__YGOCARDDATA__"] = {};

    // recover config from localStorage
    this.recover = recover;
    if (recover) {
      var tempConfig = Object.assign({}, config);
      for (let key in config) {
        if (localStorage.getItem(key)) {
          tempConfig[key] = JSON.parse(localStorage.getItem(key));
        }
      }
    }

    this.config = tempConfig || config;
    this.key = data._id;

    if (moldPath[moldPath.length - 1] === "/") {
      moldPath = moldPath.substring(0, moldPath.length - 1);
    }
    this.moldPath = moldPath;

    // events register
    this.fontLoaded = fontLoaded;
    this.imageLoaded = imageLoaded;
    this.fontsLoaded = fontsLoaded;
    this.imagesLoaded = imagesLoaded;
    this.picLoaded = picLoaded;
    this.loaded = loaded;

    this.getPic = getPic;
    this.lang = lang;
    this.imgStatus = false;
    this.db_id = null;
    this.flashImg = null;
    this.holo = holo;
    this.cardbagSwitch = cardbagSwitch;
    this.passwordSwitch = passwordSwitch;
    this.translate = translate;
    this.verbose = verbose;
    this.autoResize = autoResize;
    this.renderState = false;

    this.data = new CardData(this.transType(data), this);
    this.size = size;
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
    let ratio = this.getPixelRatio;

    if (size) {
      this.size = [size[0] * ratio, size[1] * ratio];
    } else {
      if (!this.size) {
        this.size = this.ansysSize();
        if (this.autoResize) {
          // 当canvas实际尺寸发生变化时，提交一个canvas重绘的异步请求
          this.sizeObserver = new ResizeObserver(() => {
            this.resize();
          });
          this.sizeObserver.observe(this.canvas);
          /*
          重绘函数中会调整canvas尺寸属性，这会再次引起ResizeObserver的回调，从而无限迭代
          使用MutationObserver监听canvas尺寸属性的变化，清空重绘的事件队列，切断迭代
          */
          this.attriObserver = new MutationObserver(() => {
            if (this.resizer) {
              clearTimeout(this.resizer);
              this.resizer = null;
            }
          });
          this.attriObserver.observe(this.canvas, {
            attributes: true,
            attributeFilter: ["width", "height"],
          });
        }
      } else {
        this.size = [this.size[0] * ratio, this.size[1] * ratio];
      }
    }

    this.cardDrawer = new CardDrawer(this);
    this.cardFile = new CardFile(this);
  }

  async render() {
    await this.cardFile.loadAll();
    return true;
  }

  clearFlash() {
    this.flashImg = null;
    this.data.flash = 0;
  }

  feed(img, imgStatus = false) {
    this.cardFile.fileContent.pic = img;
    this.imgStatus = imgStatus;

    // 当图片改变，闪面特效自动关闭
    this.clearFlash();
    
    this.draw();
  }

  changeConfig(config) {
    this.config = config;
    this.render();
  }

  draw(size, config) {
    if (this.renderState) {
      this.cardDrawer.draw(this.data, this.cardFile.fileContent, size, config);
    }
  }

  async save(saveName, size = [1626, 2370]) {
    let [w, h] = [this.canvas.width, this.canvas.height];
    await this.draw(size);

    let dataURI = this.canvas.toDataURL("image/png");

    var binStr = atob(dataURI.split(",")[1]),
      len = binStr.length,
      arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    let blob = new Blob([arr]);

    var objurl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = saveName || this.data.name + ".png";
    link.href = objurl;
    link.click();

    this.draw();
  }

  autoDraw() {
    setInterval(() => {
      this.draw();
    }, 200);
  }

  feedData(data) {
    for (let key in data) {
      this.data[key] = data[key];
    }
  }

  copy(card) {
    this.cardDrawer.draw(card.data, card.cardFile.fileContent);
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

    localStorage.setItem("lang", this.lang);
  }

  feedFlash(img) {
    this.flashImg = img;
    this.data.flash = 0;
  }

  rounded(num) {
    let rounded = (0.5 + num) | 0;
    rounded = ~~(0.5 + num);
    rounded = (0.5 + num) << 0;
    return rounded;
  }

  ansysSize() {
    let ratio = this.getPixelRatio;
    let w = ratio * this.canvas.clientWidth;
    let h = ratio * this.canvas.clientHeight;

    let currentRate = h / w;
    if (currentRate > this.RATE) {
      h = w * this.RATE;
    } else if (this.RATE > currentRate) {
      w = h / this.RATE;
    }

    w = this.rounded(w);
    h = this.rounded(h);

    if (
      Math.abs(w - this.canvas.width) / this.canvas.width <= 0.01 ||
      Math.abs(h - this.canvas.height) / this.canvas.height <= 0.01
    ) {
      return [this.canvas.width, this.canvas.height];
    } else {
      return [w, h];
    }
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

  get getPixelRatio() {
    let context = this.canvas.getContext("2d");
    let backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;

    return (window.devicePixelRatio || 1) / backingStore;
  }

  transType(data) {
    return transType(data);
  }

  static transData(data) {
    return variation(data);
  }

  static complex(text) {
    return translate(text);
  }

  static readYDK(text) {
    return readYDK(text);
  }

  static getData(data) {
    return new Card({ data }).data;
  }
}

export const config = defaultConfig;
export const configs = {
  cn: defaultConfig,
  cnSimplify: cnSimplifyConfig,
  jp: defaultJpConfig,
  jpNotation: jpWitchNotationConfig,
  en: defaultEnConfig,
};
