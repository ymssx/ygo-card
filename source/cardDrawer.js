export default class CardDrawer {
  constructor(admin) {
    this.admin = admin;
    this.canvas = this.admin.canvas.getContext('2d');
  }

  isPunctuation(char) {
    const reg = new RegExp("[\u0000-\u00ff]");
    const reg2 = new RegExp("[\uff00-\uffff]");
    const punctuationMap = ['。', '，', '：', '【', '】'];
    return reg.test(char) || reg2.test(char) || punctuationMap.includes(char);
  }
  
  descSplit(desc, fontSize, font, maxLines = 6, maxWidth = 683) {
    const c = this.canvas;
    c.font = fontSize + "px " + font;
    const descList = desc.split('\n');

    // 当初始分段数超过最大行数时，将多出部分直接压入最后一行
    while (descList.length > maxLines) {
      const resPara = descList.pop();
      descList[maxLines - 1] += resPara;
    }

    // 评估当前实际是否超出最大行数

    // 根据缩放比例获取实际行数
    const getCurrentLines = (scale) => {
      return descList.reduce((lines, para) => {
        lines += Math.ceil(scale * c.measureText(para).width / maxWidth);
        return lines;
      }, 0);
    };
    
    // 缩放比例从1逐渐降为0
    let scale = 1;
    while (getCurrentLines(scale) > maxLines && scale > 0) {
      scale -= 0.01;
    }

    let res = [];
    for (let para of descList) {
      const oneLineWidth = scale * c.measureText(para).width;
      const needLines = Math.ceil(oneLineWidth / maxWidth);      
      const oneLineMaxWidth = oneLineWidth / needLines;
      let currentRes = [];
      let currentLine = '';
      for (let word of para) {
        // 如果某行首字为标点符号，那么会将其压入上一行。
        if (currentLine === '' && currentRes.length > 0 && this.isPunctuation(word)) {
          currentRes[currentRes.length - 1] += word;
        } else {
          currentLine += word;
          if (scale * c.measureText(currentLine).width >= oneLineMaxWidth) {
            currentRes.push(currentLine);
            currentLine = '';
          }
        }
      }
      if (currentLine) {
        currentRes.push(currentLine);
      }
      res = res.concat(currentRes);
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
    const { maxWidth, maxLines, lineHeight, position } = descConfig;

    for (let index in descParts) {
      let descPart = descParts[index];
      let left = position[0];
      let top = position[1] + index * lineHeight;
      if (index === maxLines - 1) {
        let tempWidth = c.measureText(descPart).width;
        if (tempWidth < maxWidth * r) {
          c.fillText(descPart, left * r, top * r, c.measureText(descPart.slice(0, -1)).width);
        } else {
          c.fillText(descPart, left * r, top * r, maxWidth * r);
        }
      } else {
        c.fillText(descPart, left * r, top * r, maxWidth * r);
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
    if (this.drawer) {
      window.cancelAnimationFrame(this.drawer);
    }
    
    this.drawer = window.requestAnimationFrame(() => {
      this._draw_(...args);
    })
  }
  
  _draw_(cardData, fileContent, size = this.admin.size, config = this.admin.config.style, callback) {    
    this.admin.canvas.width = size[0];
    this.admin.canvas.height = size[1];
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
    if (window['__YGOCARDDATA__'].fontMap[config.name.font]) {
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
    if (window['__YGOCARDDATA__'].fontMap[config.race.font]) {
      if (cardData.type === 'monster') {
        c.fillStyle = '#000000';
        c.font = (config.race.fontWieght?(config.race.fontWieght + ' '):'') + config.race.fontSize * r + "px " + config.race.font;
        c.fillText(cardData._ifm_, config.race.position[0] * r, config.race.position[1] * r, config.race.maxWidth * r);
      } else {
        let type = cardData._spellType_;
        c.fillStyle = '#000000';
        c.font = config.type.fontSize * r + "px " + config.type.font + fontPlus;
        let fontLeft = config.type.position[0] * r - c.measureText(type).width;
        c.fillText(type, fontLeft, config.type.position[1] * r);

        if (cardData.type2 !== 'tc') {
          try {
            c.drawImage(fileContent.icon, config.type.icon[0] * r, config.type.icon[1] * r, 46 * r, 46 * r);
          } catch(e) {
            console.log(e);
          }
        }
      }
    }

    // draw desc
    let descConfig;
    if (cardData.type === 'monster') {
      descConfig = config.monsterDesc;
    } else {
      descConfig = config.spellDesc;
    }

    if (window['__YGOCARDDATA__'].fontMap[descConfig.font]) {
      var descParts;
      if (descConfig.splitMode === 'cn') {
        descParts = this.descSplit(cardData._desc_, descConfig.fontSize, descConfig.font, descConfig.maxLines);
      } else {
        descParts = this.descSplitEn(cardData._desc_, descConfig.fontSize, descConfig.font, descConfig.maxLines);
      }

      c.fillStyle = '#000';
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
      let leftPosition = config.pendulumNumber.positonLeft;
      let rightPosition = config.pendulumNumber.positonRight;
      c.save();
      c.textAlign = 'center';
      c.fillText(cardData.lb_num, leftPosition[0] * r, leftPosition[1] * r);
      c.fillText(cardData.lb_num, rightPosition[0] * r, rightPosition[1] * r);
      c.restore();
    }

    // draw ATK/DEF
    if (window['__YGOCARDDATA__'].fontMap[config.ATK.font]) {
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
      const link = cardData._link_;
      const linkConfig = config.linkArrows;
      const drawArrow = (type, value) => {
        if (type === 0) {
          if (value) {
            c.drawImage(fileContent.arrow1_1, linkConfig.arrow1.position[0] * r, linkConfig.arrow1.position[1] * r, linkConfig.arrow1.size[0] * r, linkConfig.arrow1.size[1] * r);
          } else {
            c.drawImage(fileContent.arrow1_0, linkConfig.arrow1.position[0] * r, linkConfig.arrow1.position[1] * r, linkConfig.arrow1.size[0] * r, linkConfig.arrow1.size[1] * r);
          }
        } else {
          if (value) {
            c.drawImage(fileContent.arrow2_1, linkConfig.arrow2.position[0] * r, linkConfig.arrow2.position[1] * r, linkConfig.arrow2.size[0] * r, linkConfig.arrow2.size[1] * r);
          } else {
            c.drawImage(fileContent.arrow2_0, linkConfig.arrow2.position[0] * r, linkConfig.arrow2.position[1] * r, linkConfig.arrow2.size[0] * r, linkConfig.arrow2.size[1] * r);
          }
        }
      }

      c.save();
      // 原点设置到卡图中心
      c.translate(linkConfig.center[0] * r, linkConfig.center[1] * r);
      c.save();

      drawArrow(0, link[6]);
      c.rotate(Math.PI / 2);
      drawArrow(0, link[3]);
      c.rotate(Math.PI / 2);
      drawArrow(0, link[1]);
      c.rotate(Math.PI / 2);
      drawArrow(0, link[4]);

      c.restore();
      drawArrow(1, link[5]);
      c.rotate(Math.PI / 2);
      drawArrow(1, link[0]);
      c.rotate(Math.PI / 2);
      drawArrow(1, link[2]);
      c.rotate(Math.PI / 2);
      drawArrow(1, link[7]);

      c.restore();
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
      c.save();
      c.fillStyle = '#000000';
      if (cardData.type2 === 'cl' && cardData.type3 !== 'lb') {
        c.fillStyle = '#ffffff';
      }
      c.font = config.cardbag.fontSize * r + "px " + config.cardbag.font;
      let cardbagLeft, cardbagTop;
      c.textAlign = 'right';
      if (cardData.type2 !== 'lj') {
        if (cardData.type3 === 'lb') {
          c.textAlign = 'left';
          cardbagLeft = config.cardbag.pendulumPosition[0] * r;
          cardbagTop = config.cardbag.pendulumPosition[1] * r;
        } else {
          cardbagLeft = config.cardbag.position[0] * r;
          cardbagTop = config.cardbag.position[1] * r;
        };
      } else {
        cardbagLeft = config.cardbag.linkPosition[0] * r;
        cardbagTop = config.cardbag.linkPosition[1] * r;
      }
      c.fillText(cardData.cardbag, cardbagLeft, cardbagTop);
      c.restore();
    }

    // draw password
    if (cardData._id && this.admin.passwordSwitch) {
      c.save();
      c.fillStyle = '#000000';
      if (cardData.type2 === 'cl' && cardData.type3 !== 'lb') {
        c.fillStyle = '#ffffff';
      }
      c.font = config.password.fontSize * r + "px " + config.password.font;
      c.fillText(cardData._id, config.password.position[0] * r, config.password.position[1] * r);
      c.restore();
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
