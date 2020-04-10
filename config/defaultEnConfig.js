export default {
  "moldName": "default",
  "moldUrl": "./mold/",
  "fonts": {
    "en_name": "https://xmg520-1257059753.cos.ap-guangzhou.myqcloud.com/en_name.ttf",
    "en": "https://xmg520-1257059753.cos.ap-guangzhou.myqcloud.com/en.ttf",
    "number": "https://xmg520-1257059753.cos.ap-guangzhou.myqcloud.com/number.ttf",
    "link": "https://xmg520-1257059753.cos.ap-guangzhou.myqcloud.com/link.ttf",
    "race": "https://xmg520-1257059753.cos.ap-guangzhou.myqcloud.com/race.ttf",
  },
  "pic": function(id) {
    // 'https://ymssx.gitee.io/pics/500/'+this.cardData._id + '.jpg';
    return 'https://cose.xyz:1803/php/getPic.php?_id='+ id + '&w=500&h=500';
  },
  "style": {
    "moldSize": [813, 1185],
    "name": {
      "font": "en_name",
      "fontSize": 65,
      "maxWidth": 610,
      "position": [65, 114]
    },
    "pic": {
      "position": [101, 220, 615, 616],
      "position_lb": [57, 213, 702, 528]
    },
    "attribute": {
      "position": [680, 57, 75, 75],
      "size": [66, 66]
    },
    "level": {
      "position": [686, 145],
      "size": [50, 50],
      "distance": 55
    },
    "holo": {
      "position": [755, 1125],
      "size": [30, 30]
    },
    "monsterDesc": {
      "splitMode": "en",
      "font": "en",
      "fontSize": 24,
      "lbFontSize": 22,
      "position": [66, 950],
      "lbPosition": [130, 773],
      "lineHeight": 26,
      "lbLineHeight": 24.5,
      "maxLines": 6
    },
    "magicDesc": {
      "splitMode": "en",
      "font": "en",
      "fontSize": 24,
      "position": [66, 915],
      "lineHeight": 24,
      "maxLines": 9
    },
    "race": {
      "font": "race",
      "fontSize": 32,
      "fontWieght": "bold",
      "position": [64, 920],
      "maxWidth": 610
    },
    "type": {
      "font": "cn",
      "fontSize": 48,
      "position": [750, 185],
      "icon": [667, 147],
      "iconSize": [46, 46]
    },
    "ATK": {
      "font": "number",
      "fontSize": 36,
      "position": [585, 1107]
    },
    "DEF": {
      "font": "link",
      "fontSize": 36,
      "position": [750, 1107]
    }
  },
  "translate": {
    "attribute": {
      "light": '光', "dark": '暗', "wind": '风', "water": '水', "fire": '炎', "ground": '地', "god": '神'
    },
    "type": {
      "tc": 'normal', "xg": '效果', "ys": '儀式', "rh": '融合', "tt": '同调', "cl": '超量', "lb": '靈擺', "lj": '連接', "ec": '二重', "tz": '調整', "tm": '同盟', "tk": '卡通', "lh": '灵魂', "fz": '反转', "kt": '卡通', "ts": '特殊召唤', "zb": '装备', "sg": '速攻', "cd": '场地', "fj": '反击', "yx": '永续'
    },
    "raceList": ["龍族","戰士族","惡魔族","魔法師族","天使族","不死族","岩石族","植物族","昆蟲族","水族","炎族","雷族","魚族","海龍族","幻龍族","恐龍族","爬蟲族","機械族","獸族","鳥獸族","獸戰士族","念動力族","電子界族","幻神獸族","創造神族"],
    "magic": "magic",
    "tragic": "tragic",
    "brackets": ['[' , ']']
  }
}
