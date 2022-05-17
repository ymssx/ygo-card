import { transSingleType } from "./lib/variation.js";

export default class CardData {
  constructor(dbData, admin, color) {
    this.dbData = dbData;
    this.admin = admin;

    const translate = this.admin.translateText || function() {};

    if (admin.recover) {
      for (let key in dbData) {
        if (localStorage.getItem(key)) {
          dbData[key] = localStorage.getItem(key);
        }
      }
    }

    let textUpdate = ["type4", "level", "attack", "defend", "cardbag"];
    for (let key of textUpdate) {
      Object.defineProperty(this, key, {
        get() {
          return dbData[key];
        },
        set(value) {
          if (key === "type4") {
            value = transSingleType(value);
          }
          dbData[key] = value;
          this.draw();
        },
      });
    }

    let fontUpdate = ["name", "desc", "race"];
    let tempText = {};
    for (let key of fontUpdate) {
      tempText[key] = translate(dbData[key]);
      Object.defineProperty(this, key, {
        get() {
          if (this.admin.translate) {
            return tempText[key];
          } else {
            return dbData[key];
          }
        },
        set(value) {
          let transValue;
          if (this.admin.translate) {
            transValue = translate(value);
          }

          dbData[key] = value;
          tempText[key] = transValue;
          this.draw(["text"], key);
        },
      });
    }

    Object.defineProperty(this, "lb_desc", {
      get() {
        if (dbData.lb_desc) return dbData.lb_desc;

        let desc = this._desc_;
        return this._lb_desc;
      },
      set(value) {
        if (this.admin.translate) {
          value = translate(value);
        }

        dbData.lb_desc = value;
        this.draw(["text"], "lb_desc");
      },
    });

    Object.defineProperty(this, "lb_num", {
      get() {
        if (dbData.lb_num) return dbData.lb_num;

        let desc = this._desc_;
        return this._lb_num;
      },
      set(value) {
        dbData.lb_num = value;
        this.draw(["text"], "lb_num");
      },
    });

    Object.defineProperty(this, "type", {
      get() {
        return dbData.type;
      },
      set(value) {
        let update = ["mold", "level", "attribute"];
        if (
          (value === "monster" && dbData.type !== "monster") ||
          (value !== "monster" && dbData.type === "monster")
        ) {
          dbData.type2 = "tc";
          dbData.type3 = null;
          dbData.type4 = null;
          update.push("type");
        }
        dbData.type = value;
        this.draw(update);
      },
    });

    let moldUpdate = ["type2", "type3"];
    for (let key of moldUpdate) {
      Object.defineProperty(this, key, {
        get() {
          return dbData[key];
        },
        set(value) {
          value = transSingleType(value);
          dbData[key] = value;
          if (dbData["type"] === "monster") {
            let fileList = ["mold", "level", "attribute"];
            if (dbData["type2"] === "lj") {
              fileList = fileList.concat([
                "arrow1_0",
                "arrow1_1",
                "arrow2_0",
                "arrow2_1",
              ]);
            }
            this.draw(fileList);
          } else {
            this.draw(["mold", "level", "attribute", "icon"]);
          }
        },
      });
    }

    Object.defineProperty(this, "attribute", {
      get() {
        return dbData["attribute"];
      },
      set(value) {
        dbData["attribute"] = value;
        this.draw(["attribute"]);
      },
    });

    Object.defineProperty(this, "lang", {
      get() {
        return this.admin.lang;
      },
      set(value) {
        this.admin.lang = value;
        this.draw(["attribute"]);
      },
    });

    Object.defineProperty(this, "copyright", {
      get() {
        if (dbData.copyright) {
          return dbData.copyright;
        }
        return this.admin.copyright || '';
      },
      set(value) {
        this.admin.copyright = value;
        dbData.copyright = value;
        this.draw(["text"]);
      },
    });

    Object.defineProperty(this, "link", {
      get() {
        return this._link_;
      },
      set(value) {
        dbData["link"] = value;
        this.draw();
      },
    });

    Object.defineProperty(this, "_id", {
      get() {
        return dbData["_id"];
      },
      set(value) {
        dbData["_id"] = value;
        //this.admin.key = value;
        this.draw(["pic"]);
      },
    });
    
    Object.defineProperty(this, "color", {
      get() {
        if (!color) {
          return this.defaultColor;
        }
        return color;
      },
      set(value) {
        color = value;
        this.draw(["text"]);
      },
    });
    
    Object.defineProperty(this, "outlineColor", {
      set(value) {
        outlineColor = value;
        this.draw["text"];
      },
    });

    var flash = 0;
    Object.defineProperty(this, "flash", {
      get() {
        return flash;
      },
      set(value) {
        flash = value;
        this.draw();
      },
    });

    this.caller = null;
    this.getData = function () {
      let res = {};
      for (let key in dbData) {
        res[key] = dbData[key];
      }
      return res;
    };

    this.saveToCache = function () {
      for (let key in dbData) {
        localStorage.setItem(key, dbData[key]);
      }
    };
  }

  get _attribute_() {
    const attribute = this.attribute;
    const trans = this.admin.config.translate;
    return trans.attribute[attribute];
  }

  get isSpecialMonster() {
    return ["rh", "ys", "rh", "tt", "cl", "lj"].includes(this.type2);
  }

  get _ifm_() {
    const trans = this.admin.config.translate;
    let tc = trans.type.tc;
    let xg = trans.type.xg;
    let lb = trans.type.lb;
    let rc = trans.race;
    let brackets = trans.brackets;

    const race = this.race;

    if (this.type === "monster") {
      var txt = brackets[0] + (rc[race] || race);
      if (!["tc", "xg", "tk"].includes(this.type2)) {
        txt += "/" + trans.type[this.type2];
      }
      if (this.type3 !== "tc" && this.type3 !== null && this.type3 !== "") {
        if (this.type3 === "lb") {
          var type3 = lb;
        } else {
          var type3 = trans.type[this.type3];
        }
        txt += "/" + type3;
      }
      if (
        this.type4 !== "tc" &&
        this.type4 !== null &&
        this.type4 !== "" &&
        this.type4 !== this.type3
      ) {
        txt += "/" + trans.type[this.type4];
      }
      if (this.type2 !== "tc" && this.type3 !== "tc" && this.type4 !== "tc") {
        txt += "/" + xg + brackets[1];
      } else {
        if (!this.isSpecialMonster) {
          txt += "/" + tc + brackets[1];
        } else {
          txt += brackets[1];
        }
      }
      return txt;
    } else if (this.type === "spell") {
      return brackets[0] + trans.spell + brackets[1];
    } else {
      return brackets[0] + trans.trap + brackets[1];
    }
  }

  get _spellType_() {
    let type;
    let brackets = this.admin.config.translate.brackets;
    if (this.type === "spell") {
      let text = this.admin.config.translate.spell;
      type = brackets[0] + text;
    } else {
      let text = this.admin.config.translate.trap;
      type = brackets[0] + text;
    }

    if (["cd", "fj", "sg", "ys", "yx", "zb"].includes(this.type2)) {
      type += (this.lang === "en" ? "     " : "   ") + brackets[1];
    } else {
      type += brackets[1];
    }

    return type;
  }

  get _link_() {
    if (this.type2 !== 'lj') {
      this.link_num = 0;
      return [false, false, false, false, false, false, false, false];
    }

    let link = [];
    if (this.dbData.link instanceof Array && this.dbData.link.length >= 8) {
      link = this.dbData.link.slice(0, 8);
    } else {
      const LINK_DIRECTION_SOUTHWEST = 0x1, LINK_DIRECTION_SOUTH = 0x2, LINK_DIRECTION_SOUTHEAST = 0x4,
        LINK_DIRECTION_WEST = 0x8, LINK_DIRECTION_EAST = 0x20, LINK_DIRECTION_NORTHWEST = 0x40, LINK_DIRECTION_NORTH = 0x80,
        LINK_DIRECTION_NORTHEAST = 0x100;
      const MARKER_POSITIONS = [LINK_DIRECTION_NORTHWEST, LINK_DIRECTION_NORTH, LINK_DIRECTION_NORTHEAST, LINK_DIRECTION_WEST,
        LINK_DIRECTION_EAST, LINK_DIRECTION_SOUTHWEST, LINK_DIRECTION_SOUTH, LINK_DIRECTION_SOUTHEAST];

      const linkInt = this.defend;
      for(const i in MARKER_POSITIONS) {
          link.push((linkInt & MARKER_POSITIONS[i]) === MARKER_POSITIONS[i]);
      }
    }

    this.link_num = link.reduce((num, item) => {
      num += item ? 1 : 0;
      return num;
    }, 0);

    return link;
  }

  get defaultColor() {
    if (this.type === "monster") {
      if (this.type2 === "cl" || this.type2 === "lj") {
        return "#fff";
      } else {
        return "#000";
      }
    } else {
      return "#fff";
    }
  }

  draw(key, who) {
    this.admin.cardFile.update(key, who);
  }
}
