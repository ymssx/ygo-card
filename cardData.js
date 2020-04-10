import {FileManage} from "./fileManage.js";
import {translate} from "./lib/translate.js";

export const CardData = function(dbData, admin, color) {
  this.admin = admin;

  if (admin.recover) {
    for (let key in dbData) {
      if (localStorage.getItem(key)) {
        dbData[key] = localStorage.getItem(key);
      }
    }
  }

	let textUpdate = ['type4', 'level', 'attack', 'defend', 'cardbag'];
	for (let key of textUpdate) {
		Object.defineProperty(this, key, {
			get() {
				return dbData[key];
			},
			set(value) {
			  dbData[key] = value;
				this.draw();
			}
		})
	}

	let fontUpdate = ['name', 'desc', 'race'];
  for (let key of fontUpdate) {
    Object.defineProperty(this, key, {
      get() {
        return dbData[key];
      },
      set(value) {
        if (this.admin.translate) {
          value = translate(value)
        }

        dbData[key] = value;
        this.draw(['text'], key);
      }
    })
  }

  Object.defineProperty(this, 'type', {
    get() {
      return dbData.type;
    },
    set(value) {
      let update = ['mold', 'level', 'attribute'];
      if ((value === 'monster' && dbData.type !== 'monster') || (value !== 'monster' && dbData.type === 'monster')) {
        dbData.type2 = 'tc';
        dbData.type3 = null;
        dbData.type4 = null;
        update.push('type');
      }
      dbData.type = value;
      this.draw(update);
    }
  });

	let moldUpdate = ['type2', 'type3'];
  for (let key of moldUpdate) {
    Object.defineProperty(this, key, {
      get() {
        return dbData[key];
      },
      set(value) {
        dbData[key] = value;
        if (dbData['type'] === 'monster') {
          this.draw(['mold', 'level', 'attribute']);
        } else {
          this.draw(['mold', 'level', 'attribute', 'icon']);
        }
      }
    })
  }

  Object.defineProperty(this, 'attribute', {
    get() {
      return dbData['attribute'];
    },
    set(value) {
      dbData['attribute'] = value;
      this.draw(['attribute']);
    }
  })

  Object.defineProperty(this, '_id', {
    get() {
      return dbData['_id'];
    },
    set(value) {
      dbData['_id'] = value;
      //this.admin.key = value;
      this.draw(['pic']);
    }
  });

  Object.defineProperty(this, 'color', {
    get() {
      if (!color) {
        return this.defaultColor;
      }
      return color;
    },
    set(value) {
      color = value;
      this.draw();
    }
  });

  var flash = 0;
  Object.defineProperty(this, 'flash', {
    get() {
      return flash;
    },
    set(value) {
      flash = value;
      this.draw();
    }
  });

	this.caller = null;
  this.getData = function() {
    let res = {};
    for (let key in dbData) {
      res[key] = dbData[key];
    }
    return res;
  }

  this.saveToCache = function () {
    for (let key in dbData) {
      localStorage.setItem(key, dbData[key]);
    }
  }
};

CardData.prototype = {
  get _attribute_() {
      const attribute = this.attribute;
      const trans = this.admin.config.translate;
      return trans.attribute[attribute];
  },
  get _desc_() {
		const desc = this.desc;
		if (this.type3 === 'lb') {
			var lb_num = parseInt(desc.substr(1));
      let temp = desc.split("→")[1];
      if (!temp) return desc;

			var lb_desc = temp.split("【")[0].replace("\r", "").replace("\n", "").replace(" ", "");
			var desc_ = temp.split("】")[1].replace("\r", "").replace("\n", "").replace(" ", "");
			this.lb_num = lb_num;
			this.lb_desc = lb_desc;
		} else {
			var desc_ = desc.replace("\r", "").replace("\n", "").replace(" ", "");
		}
		return desc_;
	},
	get _ifm_() {
		const race = this.race;
		const trans = this.admin.config.translate;

		let tc = trans.type.tc;
		let xg = trans.type.xg;
		let lb = trans.type.lb;
		let brackets = trans.brackets;

		if (this.type === "monster") {
			var txt = brackets[0] + race;
			if (this.type2 !== "tc" && this.type2 !== "xg") {
				txt += "/" + trans.type[this.type2];
			}
			if (this.type3 !== "tc" && this.type3 !== null && this.type3 !== "") {
				if (this.type3 === 'lb') {
					var type3 = lb;
				} else {
					var type3 = trans.type[this.type3];
				}
				txt += "/" + type3;
			}
			if (this.type4 !== "tc" && this.type4 !== null && this.type4 !== "" && this.type4 !== this.type3) {
				txt += "/" + trans.type[this.type4];
			}
			if (this.type2 !== "tc" && this.type3 !== "tc" && this.type4 !== "tc") {
				txt += "/" + xg + brackets[1];
			} else {
				txt += "/" + tc + brackets[1];
			}
			return txt;
		} else if (this.type === "magic") {
			return brackets[0] + trans.magic + brackets[1];
		} else {
			return brackets[0] + trans.tragic + brackets[1];
		}
	},
  get _magicType_() {
    let type;
    let brackets = this.admin.config.translate.brackets;
    if (this.type === 'magic') {
      let text = this.admin.config.translate.magic;
      type = brackets[0] + text;
    } else {
      let text = this.admin.config.translate.tragic;
      type = brackets[0] + text;
    }

    if (this.type2 === 'tc') {
      type += brackets[1];
    } else {
      type += '   ' + brackets[1];
    }

    return type;
  },
	get _link_() {
		if (this.type2 !== "lj") {
			this.link_num = 0;
			return [false, false, false, false, false, false, false, false, false];
    }
    
		let link = this.defend;
		let link_ = link.toString(2);
		if (link_.length>9) {
			link_=link_.substr(-9);
		}
		let num = 0;
		let res = [false, false, false, false, false, false, false, false, false];
		for (let i = 0; i < link_.length; i++) {
			let s = link_.substr(i, 1);
			if (parseInt(s)) {
				res[i+9-link_.length] = true;
				num++;
			}
		}
		this.link_num = num;
		return res;
	},
  get defaultColor() {
    if (this.type === 'monster') {
      if (this.type2 === 'cl' || this.type2 === 'lj') {
        return '#fff'
      } else {
        return '#000'
      }
    } else {
      return '#fff'
    }
  },
	draw(key, who) {
		if (this.caller instanceof FileManage) {
			this.caller.update(key, who);
		} else {
			console.error('you need bind a drawer first');
		}
	}
}
