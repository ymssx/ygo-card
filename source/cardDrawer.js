export default class CardDrawer {
  constructor(admin) {
    this.admin = admin;
    this.canvas = this.admin.canvas.getContext("2d");
  }

  isPunctuation(char) {
    const reg = new RegExp("[\u0000-\u00ff]");
    const reg2 = new RegExp("[\uff00-\uffff]");
    const punctuationMap = ["。", "，", "：", "【", "】", "「", "」"];
    return reg.test(char) || reg2.test(char) || punctuationMap.includes(char);
  }

  descSplit(desc, fontSize, font, maxLines = 6, maxWidth = 683) {
    if (!desc) return [];

    const c = this.canvas;
    c.font = fontSize + "px " + font;
    const descList = desc.split("\n");

    // 当初始分段数超过最大行数时，将多出部分直接压入最后一行
    while (descList.length > maxLines) {
      const resPara = descList.pop();
      descList[maxLines - 1] += resPara;
    }

    // 评估当前实际是否超出最大行数

    // 根据缩放比例获取实际行数
    const getCurrentLines = (scale) => {
      return descList.reduce((lines, para) => {
        lines += Math.ceil((scale * c.measureText(para).width) / maxWidth);
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
      const oneLineMaxWidth = Math.max(
        scale * maxWidth,
        oneLineWidth / needLines
      );
      let currentRes = [];
      let currentLine = "";
      for (let word of para) {
        // 如果某行首字为标点符号，那么会将其压入上一行。
        if (
          currentLine === "" &&
          currentRes.length > 0 &&
          this.isPunctuation(word)
        ) {
          currentRes[currentRes.length - 1] += word;
        } else {
          currentLine += word;
          if (scale * c.measureText(currentLine).width >= oneLineMaxWidth) {
            currentRes.push(currentLine);
            currentLine = "";
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
    if (!desc) return [];

    const c = this.canvas;
    c.font = fontSize + "px " + font;
    const descList = desc.split("\n");

    // 当初始分段数超过最大行数时，将多出部分直接压入最后一行
    while (descList.length > maxLines) {
      const resPara = descList.pop();
      descList[maxLines - 1] += resPara;
    }

    // 评估当前实际是否超出最大行数

    // 根据缩放比例获取实际行数
    const getCurrentLines = (scale) => {
      return descList.reduce((lines, para) => {
        lines += Math.ceil((scale * c.measureText(para).width) / maxWidth);
        return lines;
      }, 0);
    };

    // 缩放比例从1逐渐降为0
    let scale = 1;
    while (getCurrentLines(scale) > maxLines && scale > 0) {
      scale -= 0.01;
    }

    let res = [];
    for (const para of descList) {
      const oneLineWidth = scale * c.measureText(para).width;
      const needLines = Math.ceil(oneLineWidth / maxWidth);
      const oneLineMaxWidth = Math.max(
        scale * maxWidth,
        oneLineWidth / needLines
      );

      const currentRes = [];
      let currentLine = [];
      for (const word of para.split(" ")) {
        currentLine.push(word);

        const currentLineWidth = c.measureText(currentLine.join(" ")).width;
        if (scale * currentLineWidth >= oneLineMaxWidth) {
          if (
            scale * currentLineWidth - oneLineMaxWidth >
            c.measureText(" " + word).width / 2
          ) {
            currentLine.pop();
            currentRes.push(currentLine);
            currentLine = [word];
          } else {
            currentRes.push(currentLine);
            currentLine = [];
          }
        }
      }
      if (currentLine.length) {
        currentRes.push(currentLine);
      }
      res = res.concat(currentRes);
    }

    return res;
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
          c.fillText(
            descPart,
            left * r,
            top * r,
            c.measureText(descPart.slice(0, -1)).width
          );
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

      c.fillText(
        descPart.join(" "),
        start * r,
        top * r,
        descConfig.maxWidth * r
      );
    }
  }

  fontMap(key) {
    if (typeof global !== "undefined") {
      return true;
    } else {
      return window["__YGOCARDDATA__"].fontMap[key];
    }
  }

  getFontName(key, config) {
    return config.fontMap[key] || key;
  }

  draw(
    cardData,
    fileContent,
    size = this.admin.size,
    config = this.admin.config.style,
    callback
  ) {
    this.admin.canvas.width = size[0];
    this.admin.canvas.height = size[1];
    const r = size[0] / config.moldSize[0];
    const c = this.canvas;

    let fontPlus = "";
    if (this.admin.fastFont) {
      fontPlus +=
        this.admin.key + "," + this.getFontName(config.name.font, config);
    }

    // draw card frame
    try {
      if (fileContent.mold) {
        c.drawImage(
          fileContent.mold,
          0,
          0,
          config.moldSize[0],
          config.moldSize[1],
          0,
          0,
          size[0],
          size[1]
        );
      }
    } catch (e) {
      return;
    }

    // draw card pic
    try {
      if (fileContent.pic) {
        if (cardData.type3 !== "lb") {
          c.drawImage(
            fileContent.pic,
            config.pic.position[0] * r,
            config.pic.position[1] * r,
            config.pic.position[2] * r,
            config.pic.position[3] * r
          );

          if (cardData.flash > 0 && this.admin.flashImg) {
            c.globalAlpha = cardData.flash;
            c.drawImage(
              this.admin.flashImg,
              config.pic.position[0] * r,
              config.pic.position[1] * r,
              config.pic.position[2] * r,
              config.pic.position[3] * r
            );
            c.globalAlpha = 1;
          }
        } else {
          c.drawImage(
            fileContent.pic,
            config.pic.position_lb[0] * r,
            config.pic.position_lb[1] * r,
            config.pic.position_lb[2] * r,
            config.pic.position_lb[3] * r
          );

          if (cardData.flash > 0 && this.admin.flashImg) {
            c.globalAlpha = cardData.flash;
            c.drawImage(
              this.admin.flashImg,
              config.pic.position_lb[0] * r,
              config.pic.position_lb[1] * r,
              config.pic.position_lb[2] * r,
              config.pic.position_lb[3] * r
            );
            c.globalAlpha = 1;
          }
        }
      }
    } catch (e) {
      return;
    }

    // draw card name
    if (this.fontMap(this.getFontName(config.name.font, config))) {
      c.save();
      c.fillStyle = cardData.color;
      c.textBaseline = "middle";
      c.font =
        config.name.fontSize * r +
        "px " +
        this.getFontName(config.name.font, config) +
        fontPlus;

      c.fillText(
        cardData.name,
        config.name.position[0] * r,
        config.name.position[1] * r,
        config.name.maxWidth * r
      );

      let outlineColor = cardData.outlineColor;
      let outlineWidth = cardData.outlineWidth;
      // 当为同调怪兽且为银/金色卡名时，默认带上灰色描边
      if (
        cardData.type2 === "tt" &&
        ["#fff", "#ffffff", "white", "#fbd705"].includes(cardData.color)
      ) {
        outlineColor = outlineColor || "#888";
        outlineWidth = outlineWidth || 1.2;
      }

      if (outlineColor && outlineWidth) {
        c.strokeStyle = outlineColor;
        c.lineWidth = outlineWidth * r;
        c.strokeText(
          cardData.name,
          config.name.position[0] * r,
          config.name.position[1] * r,
          config.name.maxWidth * r
        );
      }

      c.restore();
    }

    // draw attribute
    fileContent.attribute &&
      c.drawImage(
        fileContent.attribute,
        0,
        0,
        config.attribute.size[0],
        config.attribute.size[1],
        config.attribute.position[0] * r,
        config.attribute.position[1] * r,
        config.attribute.position[2] * r,
        config.attribute.position[3] * r
      );

    // draw level
    if (
      fileContent.level &&
      cardData.type === "monster" &&
      cardData.type2 !== "lj"
    ) {
      for (let i = 0; i < cardData.level; i++) {
        let levelLeft;
        if (cardData.type2 !== "cl") {
          levelLeft = config.level.position[0] - config.level.distance * i;
        } else {
          levelLeft =
            config.moldSize[0] -
            config.level.size[0] -
            config.level.position[0] +
            config.level.distance * i;
        }
        c.drawImage(
          fileContent.level,
          levelLeft * r,
          config.level.position[1] * r,
          config.level.size[0] * r,
          config.level.size[1] * r
        );
      }
    }

    // draw race
    if (this.fontMap(this.getFontName(config.race.font, config))) {
      if (cardData.type === "monster") {
        c.fillStyle = "#000000";
        c.font =
          (config.race.fontWieght ? config.race.fontWieght + " " : "") +
          config.race.fontSize * r +
          "px " +
          this.getFontName(config.race.font, config);
        c.fillText(
          cardData._ifm_,
          config.race.position[0] * r,
          config.race.position[1] * r,
          config.race.maxWidth * r
        );
      } else {
        let type = cardData._spellType_;
        c.fillStyle = "#000000";
        c.font =
          config.type.fontSize * r +
          "px " +
          this.getFontName(config.type.font, config) +
          fontPlus;
        let fontLeft = config.type.position[0] * r - c.measureText(type).width;
        c.fillText(type, fontLeft, config.type.position[1] * r);

        if (["cd", "fj", "sg", "ys", "yx", "zb"].includes(cardData.type2)) {
          try {
            c.drawImage(
              fileContent.icon,
              config.type.icon[0] * r,
              config.type.icon[1] * r,
              46 * r,
              46 * r
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    }

    // draw desc
    let descConfig;
    if (cardData.type === "monster") {
      descConfig = config.monsterDesc;
    } else {
      descConfig = config.spellDesc;
    }

    if (this.fontMap(this.getFontName(descConfig.font, config))) {
      let descParts;
      if (cardData.lang !== "en") {
        descParts = this.descSplit(
          cardData.desc,
          descConfig.fontSize,
          this.getFontName(descConfig.font, config),
          descConfig.maxLines
        );
      } else {
        descParts = this.descSplitEn(
          cardData.desc,
          descConfig.fontSize,
          this.getFontName(descConfig.font, config),
          descConfig.maxLines
        );
      }

      c.fillStyle = "#000";
      const style = descConfig.style ? descConfig.style + " " : "";
      c.font =
        style +
        descConfig.fontSize * r +
        "px " +
        this.getFontName(descConfig.font, config) +
        fontPlus;

      if (cardData.lang !== "en") {
        this.drawDesc(descParts, descConfig, r);
      } else {
        this.drawEnDesc(descParts, descConfig, r);
      }

      // draw pendulum desc
      if (cardData.type3 === "lb" && cardData.lb_desc) {
        let descConfig = config.monsterDesc;
        let descParts;
        if (cardData.lang !== "en") {
          descParts = this.descSplit(
            cardData.lb_desc,
            descConfig.lbFontSize,
            descConfig.font,
            descConfig.lbMaxLines,
            descConfig.lbMaxWidth
          );
        } else {
          descParts = this.descSplitEn(
            cardData.lb_desc,
            descConfig.lbFontSize,
            descConfig.font,
            descConfig.lbMaxLines,
            descConfig.lbMaxWidth
          );
        }

        c.fillStyle = "#000";
        const style = descConfig.style ? descConfig.style + " " : "";
        c.font =
          style +
          descConfig.lbFontSize * r +
          "px " +
          this.getFontName(descConfig.font, config) +
          fontPlus;

        const lbConfig = {
          maxWidth: descConfig.lbMaxWidth,
          maxLines: descConfig.lbMaxLines,
          lineHeight: descConfig.lbLineHeight,
          position: descConfig.lbPosition,
        };

        if (cardData.lang !== "en") {
          this.drawDesc(descParts, lbConfig, r);
        } else {
          this.drawEnDesc(descParts, lbConfig, r);
        }
      }
    }

    // pendulum number
    if (cardData.type3 === "lb" && cardData.lb_num) {
      c.fillStyle = "#000000";
      c.font =
        config.pendulumNumber.fontSize * r +
        "px " +
        this.getFontName(config.pendulumNumber.font, config);
      let leftPosition = config.pendulumNumber.positonLeft;
      let rightPosition = config.pendulumNumber.positonRight;
      c.save();
      const pendulumLeft =
        leftPosition[0] - c.measureText(cardData.lb_num).width / 2;
      const pendulumRight =
        rightPosition[0] - c.measureText(cardData.lb_num).width / 2;
      c.fillText(cardData.lb_num, pendulumLeft * r, leftPosition[1] * r);
      c.fillText(cardData.lb_num, pendulumRight * r, rightPosition[1] * r);
      c.restore();
    }

    // draw ATK/DEF
    if (this.fontMap(this.getFontName(config.ATK.font, config))) {
      if (cardData.type === "monster") {
        // draw line
        c.lineWidth = config.line.lineWidth * r;
        c.beginPath();
        c.moveTo(config.line.position[0] * r, config.line.position[1] * r);
        c.lineTo(
          (config.line.position[0] + config.line.width) * r,
          config.line.position[1] * r
        );
        c.stroke();
        c.save();

        c.fillStyle = "#000000";
        c.font =
          config.ATK.fontSize * r +
          "px " +
          this.getFontName(config.ATK.font, config);
        c.textAlign = "right";

        c.fillText(
          cardData.attack,
          config.ATK.position[0] * r,
          config.ATK.position[1] * r,
          config.ATK.maxWidth * r
        );

        c.fillText(
          config.ATK.label,
          config.ATK.labelPosition[0] * r,
          config.ATK.labelPosition[1] * r
        );

        if (cardData.type2 !== "lj") {
          c.fillText(
            cardData.defend,
            config.DEF.position[0] * r,
            config.DEF.position[1] * r,
            config.DEF.maxWidth * r
          );

          c.fillText(
            config.DEF.label,
            config.DEF.labelPosition[0] * r,
            config.DEF.labelPosition[1] * r
          );
        } else {
          cardData._link_;
          c.fillStyle = "#000000";
          c.font =
            config.DEF.linkFontSize * r +
            "px " +
            this.getFontName(config.DEF.font, config);
          c.fillText(
            cardData.link_num,
            config.DEF.position[0] * r,
            config.DEF.position[1] * r,
            config.DEF.maxWidth * r
          );

          c.fillText(
            config.DEF.linkLabel,
            config.DEF.linkLabelPosition[0] * r,
            config.DEF.linkLabelPosition[1] * r
          );
        }
      }
      c.restore();
    }

    // link arrows
    if (cardData.type2 === "lj") {
      const link = cardData._link_;
      const linkConfig = config.linkArrows;
      const drawArrow = (type, value) => {
        if (type === 0) {
          if (value) {
            c.drawImage(
              fileContent.arrow1_1,
              linkConfig.arrow1.position[0] * r,
              linkConfig.arrow1.position[1] * r,
              linkConfig.arrow1.size[0] * r,
              linkConfig.arrow1.size[1] * r
            );
          } else {
            c.drawImage(
              fileContent.arrow1_0,
              linkConfig.arrow1.position[0] * r,
              linkConfig.arrow1.position[1] * r,
              linkConfig.arrow1.size[0] * r,
              linkConfig.arrow1.size[1] * r
            );
          }
        } else {
          if (value) {
            c.drawImage(
              fileContent.arrow2_1,
              linkConfig.arrow2.position[0] * r,
              linkConfig.arrow2.position[1] * r,
              linkConfig.arrow2.size[0] * r,
              linkConfig.arrow2.size[1] * r
            );
          } else {
            c.drawImage(
              fileContent.arrow2_0,
              linkConfig.arrow2.position[0] * r,
              linkConfig.arrow2.position[1] * r,
              linkConfig.arrow2.size[0] * r,
              linkConfig.arrow2.size[1] * r
            );
          }
        }
      };

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
      c.drawImage(
        fileContent.holo,
        config.holo.position[0] * r,
        config.holo.position[1] * r,
        config.holo.size[0] * r,
        config.holo.size[1] * r
      );
      if (cardData.flash > 0 && fileContent.holo_flash) {
        c.globalAlpha = cardData.flash * 0.7;
        c.drawImage(
          fileContent.holo_flash,
          config.holo.position[0] * r,
          config.holo.position[1] * r,
          config.holo.size[0] * r,
          config.holo.size[1] * r
        );
        c.globalAlpha = 1;
      }
    }

    // draw cardbag
    if (cardData.cardbag && this.admin.cardbagSwitch) {
      c.save();
      c.fillStyle = "#000000";
      if (cardData.type2 === "cl" && cardData.type3 !== "lb") {
        c.fillStyle = "#ffffff";
      }
      c.font =
        config.cardbag.fontSize * r +
        "px " +
        this.getFontName(config.cardbag.font, config);
      let cardbagLeft, cardbagTop;
      c.textAlign = "right";
      if (cardData.type2 !== "lj") {
        if (cardData.type3 === "lb") {
          c.textAlign = "left";
          cardbagLeft = config.cardbag.pendulumPosition[0] * r;
          cardbagTop = config.cardbag.pendulumPosition[1] * r;
        } else {
          cardbagLeft = config.cardbag.position[0] * r;
          cardbagTop = config.cardbag.position[1] * r;
        }
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
      c.fillStyle = "#000000";
      if (cardData.type2 === "cl" && cardData.type3 !== "lb") {
        c.fillStyle = "#ffffff";
      }
      c.font =
        config.password.fontSize * r +
        "px " +
        this.getFontName(config.password.font, config);
      c.fillText(
        `00000000${cardData._id}`.slice(-8),
        config.password.position[0] * r,
        config.password.position[1] * r
      );
      c.restore();
    }

    // draw copyright
    c.save();
    c.font =
      config.copyright.fontSize * r +
      "px " +
      this.getFontName(config.copyright.font, config);
    c.fillStyle = "#000000";
    if (cardData.type2 === "cl" && cardData.type3 !== "lb") {
      c.fillStyle = "#ffffff";
    }
    c.textAlign = "right";
    c.fillText(
      cardData.copyright,
      config.copyright.position[0] * r,
      config.copyright.position[1] * r
    );
    c.restore();

    // save to caches
    if (this.admin.recover) {
      this.admin.saveToCache();
    }

    // callbacks
    if (this.admin.loaded instanceof Function) {
      this.admin.loaded();
    }
    if (callback instanceof Function) {
      callback();
    }
  }
}
