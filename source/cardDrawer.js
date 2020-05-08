export class CardDrawer {
  constructor(canvas, admin) {
    this.canvas = canvas.getContext('2d');
    this.admin = admin;
  }
  
  descSplit(desc, fontSize, font, maxLines = 6, maxWidth = 683) {
    const c = this.canvas;
    c.font=fontSize + "px " + font;
    let width = maxWidth;
    let orignWidth = c.measureText(desc).width;
    if (orignWidth > maxWidth * maxLines) {
      width = orignWidth / maxLines;
    }
    let res = [];
    let temp = '';
    for (let i of desc) {
      temp += i;
      if (c.measureText(temp).width >= width) {
        res.push(temp);
        temp = ''
      }
    }
    if (temp) {
      if (res.length < maxLines) {
        res.push(temp);
      } else {
        res[res.length - 1] += temp;
      }
    }

    return res;
  }
  
  descSplitEn(desc, fontSize, font, maxLines = 6, maxWidth = 683) {
    let words = desc.split(' ');
    const c = this.canvas;
    c.font=fontSize + "px " + font;
    let width = maxWidth;
    let orignWidth = c.measureText(desc).width;
    if (orignWidth > maxWidth * maxLines) {
      width = orignWidth / maxLines;
    }
    let res = [];
    let temp = [];

    let lastWidth = 0;
    for (let w of words) {
      temp.push(w);
      let thisWidth = c.measureText(temp.join(' ')).width;
      if (thisWidth >= width) {
        if(thisWidth + lastWidth - 2 * width > 0) {
          temp.pop();
          res.push(temp);
          temp = [w];
        } else {
          res.push(temp);
          temp = [];
        }
      }
    }

    if (temp.length > 0) {
      if (res.length < maxLines) {
        res.push(temp);
      } else {
        res[res.length - 1].concat(temp);
      }
    }

    let finalWidth = 0;
    for (let line of res) {
      let thisWidth = c.measureText(line.join(' ')).width;
      if (thisWidth > finalWidth) {
        finalWidth = thisWidth;
      }
    }
    let rate = maxWidth / finalWidth;

    let result = [];
    temp = [];
    let lastD = 0;
    for (let index in res) {
      let line = res[index];
      let wordsWidth = c.measureText(line.join('')).width;
      let factWidth = c.measureText(line.join(' ')).width;
      let d = lastD;
      if (index < res.length - 1 || factWidth > width) {
        if (line.length > 0) {
          d = (finalWidth - wordsWidth) / (line.length - 1);
        }
      }

      let tempWidth = 0;
      for (let w of line) {
        let thisWidth = rate * c.measureText(w).width;
        temp.push([tempWidth, thisWidth, w]);
        tempWidth += rate * d + thisWidth;
      }
      result.push(temp);
      temp = [];
      lastD = d;
    }

    return result;
  }
  
  drawDesc(descParts, descConfig, r) {
    const c = this.canvas;

    for (let index in descParts) {
      let descPart = descParts[index];
      let left = descConfig.position[0];
      let top = descConfig.position[1] + index * descConfig.lineHeight;
      if (index === descConfig.maxLines - 1) {
        let tempWidth = c.measureText(descPart).width;
        if (tempWidth < 683*r) {
          c.fillText(descPart,left*r,top*r,c.measureText(descPart.slice(0, -1)).width);
        } else {
          c.fillText(descPart,left*r,top*r,683*r);
        }
      } else {
        c.fillText(descPart,left*r,top*r,683*r);
      }
    }
  }
  
  drawEnDesc(descParts, descConfig, r) {
    const c = this.canvas;

    for (let index in descParts) {
      let descPart = descParts[index];
      let start = descConfig.position[0];
      let top = descConfig.position[1] + index * descConfig.lineHeight;

      for (let w of descPart) {
        let left = start + w[0];
        let width = w[1];
        let word = w[2];

        c.fillText(word,left*r,top*r,width*r);
      }
    }
  }
  
  draw(...args) {
    // debounce
    if (this.drawer) {
      clearTimeout(this.drawer);
    }

    this.drawer = setTimeout(() => {
      this._draw_(...args);
    }, 100);
  }
  
  _draw_(cardData, fileContent, size = this.admin.size, config = this.admin.config.style, callback) {
    const r = size[0] / config.moldSize[0];
    const c = this.canvas;

    let fontPlus = '';
    if (this.admin.fastFont) {
      fontPlus +=  this.admin.key + ',' + config.name.font;
    }

    // draw card mold
    try {
      if (fileContent.mold) {
        c.drawImage(fileContent.mold, 0, 0, config.moldSize[0], config.moldSize[1], 0, 0, r * config.moldSize[0], r * config.moldSize[1]);
      }
    } catch (e) {
      return;
    }

    // draw card pic
    try {
      if (fileContent.pic) {
        if (cardData.type3 !== 'lb') {
          c.drawImage(fileContent.pic, config.pic.position[0] * r, config.pic.position[1] * r, config.pic.position[2] * r, config.pic.position[3] * r);

          if (cardData.flash > 0 && this.admin.flashImg) {
            c.globalAlpha = cardData.flash;
            c.drawImage(this.admin.flashImg, config.pic.position[0] * r, config.pic.position[1] * r, config.pic.position[2] * r, config.pic.position[3] * r);
            c.globalAlpha = 1;
          }
        } else {
          c.drawImage(fileContent.pic, config.pic.position_lb[0] * r, config.pic.position_lb[1] * r, config.pic.position_lb[2] * r, config.pic.position_lb[3] * r);

          if (cardData.flash > 0 && this.admin.flashImg) {
            c.globalAlpha = cardData.flash;
            c.drawImage(this.admin.flashImg, config.pic.position_lb[0] * r, config.pic.position_lb[1] * r, config.pic.position_lb[2] * r, config.pic.position_lb[3] * r);
            c.globalAlpha = 1;
          }
        }
      }
    } catch (e) {
      return;
    }

    // draw card name
    if (window.fontMap[config.name.font]) {
      c.fillStyle = cardData.color;
      c.font = config.name.fontSize*r + "px " + config.name.font + fontPlus;
      c.fillText(cardData.name,config.name.position[0] * r,config.name.position[1] * r,config.name.maxWidth * r);
    }

    // draw attribute
    fileContent.attribute && c.drawImage(fileContent.attribute, 0, 0, config.attribute.size[0], config.attribute.size[1],config.attribute.position[0]*r,config.attribute.position[1]*r,config.attribute.position[2]*r,config.attribute.position[3]*r);

    // draw level
    if (fileContent.level && cardData.type === 'monster' && cardData.type2 !== 'lj') {
      for (let i = 0; i < cardData.level; i++) {
        let levelLeft;
        if (cardData.type2 !== 'cl') {
          levelLeft = config.level.position[0] - config.level.distance * i;
        } else {
          levelLeft = config.moldSize[0] - config.level.size[0] - config.level.position[0] + config.level.distance * i;
        }
        c.drawImage(fileContent.level, levelLeft * r, config.level.position[1] * r, config.level.size[0] * r, config.level.size[1] * r);
      }
    }


    // draw race
    if (window.fontMap[config.race.font]) {
      if (cardData.type === 'monster') {
        c.fillStyle = '#000000';
        c.font = (config.race.fontWieght?(config.race.fontWieght + ' '):'') + config.race.fontSize * r + "px " + config.race.font;
        c.fillText(cardData._ifm_, config.race.position[0] * r, config.race.position[1] * r, config.race.maxWidth * r);
      } else {
        let type = cardData._magicType_;
        c.fillStyle = '#000000';
        c.font = config.type.fontSize * r + "px " + config.type.font + fontPlus;
        let fontLeft = config.type.position[0] * r - c.measureText(type).width;
        c.fillText(type, fontLeft, config.type.position[1] * r);

        if (cardData.type2 !== 'tc') {
          c.drawImage(fileContent.icon, config.type.icon[0] * r, config.type.icon[1] * r, 46 * r, 46 * r);
        }
      }
    }

    // draw desc
    let descConfig;
    if (cardData.type === 'monster') {
      descConfig = config.monsterDesc;
    } else {
      descConfig = config.magicDesc;
    }

    if (window.fontMap[descConfig.font]) {
      var descParts;
      if (descConfig.splitMode === 'cn') {
        descParts = this.descSplit(cardData._desc_, descConfig.fontSize, descConfig.font, descConfig.maxLines);
      } else {
        descParts = this.descSplitEn(cardData._desc_, descConfig.fontSize, descConfig.font, descConfig.maxLines);
      }

      c.fillStyle = '#000000';
      c.font = descConfig.fontSize*r + "px " + descConfig.font + fontPlus;

      if (descConfig.splitMode === 'cn') {
        this.drawDesc(descParts, descConfig, r);
      } else {
        this.drawEnDesc(descParts, descConfig, r);
      }

      // draw pendulum desc
      if (cardData.type3 === 'lb' && cardData.lb_desc) {
        let pendulumDescParts = this.descSplit(cardData.lb_desc, config.monsterDesc.lbFontSize, config.monsterDesc.font, 5, 556);
        c.fillStyle = 'rgba(0,0,0,0.7)';
        c.font = config.monsterDesc.lbFontSize*r + "px " + config.monsterDesc.font + fontPlus;
        for (let index in pendulumDescParts) {
          let descPart = pendulumDescParts[index];
          let left = config.monsterDesc.lbPosition[0];
          let top = config.monsterDesc.lbPosition[1] + index * config.monsterDesc.lbLineHeight;
          c.fillText(descPart, left*r, top*r, 556*r);
          if (index === 4) {
            let tempWidth = c.measureText(descPart).width;
            if (tempWidth < 556*r) {
              c.fillText(descPart, left*r, top*r, c.measureText(descPart.slice(0, -1)).width);
            } else {
              c.fillText(descPart, left*r, top*r, 556*r);
            }
          } else {
            c.fillText(descPart, left*r, top*r, 556*r);
          }
        }
      }
    }

    // pendulum number
    if (cardData.type3 === 'lb' && cardData.lb_num) {
      c.fillStyle = '#000000';
      c.font = config.pendulumNumber.fontSize * r + "px " + config.pendulumNumber.font;
      let numWidth = 0.5 * Math.min(c.measureText(cardData.lb_num).width, 50);
      let leftPosition = config.pendulumNumber.positonLeft[0] - numWidth;
      let rightPosition = config.pendulumNumber.positonRight[0] - numWidth;
      c.fillText(cardData.lb_num, leftPosition, config.pendulumNumber.positonLeft[1] * r, 50 * r);
      c.fillText(cardData.lb_num, rightPosition, config.pendulumNumber.positonRight[1] * r, 50 * r);
    }

    // draw ATK/DEF
    if (window.fontMap[config.ATK.font]) {
      if (cardData.type === 'monster') {
        c.fillStyle = '#000000';
        c.font = config.ATK.fontSize * r + "px " + config.ATK.font;

        let ATKLeft = config.ATK.position[0] * r - c.measureText(cardData.attack).width;
        c.fillText(cardData.attack, ATKLeft, config.ATK.position[1] * r, 72 * r);

        if (cardData.type2 !== 'lj') {
          let DEFLeft = config.DEF.position[0] * r - c.measureText(cardData.defend).width;
          c.fillText(cardData.defend, DEFLeft, config.DEF.position[1] * r, 72 * r);
        } else {
          var link = cardData._link_;
          c.fillStyle = '#000000';
          c.font = config.DEF.fontSize * r + "px " + config.DEF.font;
          let DEFLeft = config.DEF.position[0] * r - c.measureText(cardData.link_num).width;
          c.fillText(cardData.link_num, DEFLeft, config.DEF.position[1] * r, 72 * r);
        }
      }
    }

    // link arrows
    if (cardData.type2 === 'lj') {
      c.drawImage(fileContent.arrow1_1, 334, 823)
    }

    // draw holo
    if (fileContent.holo && this.admin.holo) {
      c.drawImage(fileContent.holo, config.holo.position[0] * r, config.holo.position[1] * r, config.holo.size[0] * r, config.holo.size[1] * r);
      if (cardData.flash > 0 && fileContent.holo_flash) {
        c.globalAlpha = cardData.flash * 0.7;
        c.drawImage(fileContent.holo_flash, config.holo.position[0] * r, config.holo.position[1] * r, config.holo.size[0] * r, config.holo.size[1] * r);
        c.globalAlpha = 1;
      }
    }

    // draw cardbag
    if (cardData.cardbag && this.admin.cardbagSwitch) {
      c.fillStyle = '#000000';
      c.font = config.cardbag.fontSize * r + "px " + config.cardbag.font;
      let cardbagLeft = config.cardbag.position[0] * r - c.measureText(cardData.cardbag).width;
      c.fillText(cardData.cardbag, cardbagLeft, config.cardbag.position[1] * r);
    }

    // save to caches
    if (this.admin.recover) {
      this.admin.saveToCache();
    }
    
    // callbacks
    this.admin.loaded();
    if (callback instanceof Function) {
      callback();
    }
  }
}
