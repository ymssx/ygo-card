export default {
  "moldName": "default",
  "fonts": {
    "cn": {
      "name": "cn.ttf",
      "type": "relative"
    },
    "number": {
      "name": "number.ttf",
      "type": "relative"
    },
    "link": {
      "name": "link.ttf",
      "type": "relative"
    }
  },
  "pic": function(id) {
    return '/pics/'+ id + '.jpg';
  },
  "style": {
    "moldSize": [813, 1185],
    "name": {
      "font": "cn",
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
      "splitMode": "cn",
      "font": "cn",
      "fontSize": 24,
      "lbFontSize": 22,
      "position": [66, 942],
      "lbPosition": [130, 773],
      "lineHeight": 26,
      "lbLineHeight": 24.5,
      "maxLines": 6
    },
    "spellDesc": {
      "splitMode": "cn",
      "font": "cn",
      "fontSize": 24,
      "position": [66, 915],
      "lineHeight": 24,
      "maxLines": 9
    },
    "race": {
      "font": "cn",
      "fontSize": 26,
      "position": [53, 915],
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
    },
    "cardbag": {
      "font": "number",
      "fontSize": 30,
      "position": [735, 875]
    },
    "pendulumNumber": {
      "font": "number",
      "fontSize": 52,
      "positonLeft": [88, 854],
      "positonRight": [730, 854]
    },
    "linkArrows": {
      "center": [408, 528],
      "arrow1": {
        "size": [140, 41],
        "position": [-70, 308]
      },
      "arrow2": {
        "size": [70, 70],
        "position": [-336, 267]
      }
    }
  },
  "translate": {
    "attribute": {
      "light": '光', "dark": '暗', "wind": '风', "water": '水', "fire": '炎', "earth": '地', "divine": '神'
    },
    "type": {
      "tc": '通常', "xg": '效果', "ys": '儀式', "rh": '融合', "tt": '同調', "cl": '超量', "lb": '靈擺', "lj": '連接', "ec": '二重', "tz": '調整', "tm": '同盟', "tk": '卡通', "lh": '靈魂', "fz": '反轉', "ts": '特殊召喚', "zb": '裝備', "sg": '速攻', "cd": '場地', "fj": '反擊', "yx": '永續'
    },
    "raceList": ["龍族","戰士族","惡魔族","魔法師族","天使族","不死族","岩石族","植物族","昆蟲族","水族","炎族","雷族","魚族","海龍族","幻龍族","恐龍族","爬蟲族","機械族","獸族","鳥獸族","獸戰士族","念動力族","電子界族","幻神獸族","創造神族"],
    "spell": "魔法卡",
    "trap": "陷阱卡",
    "brackets": ['【' , '】']
  }
}
