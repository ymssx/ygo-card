export default {
  "moldName": "default",
  "fonts": {
    "en_name": {
      "name": "en_name.ttf",
      "type": "relative"
    },
    "en": {
      "name": "en.ttf",
      "type": "relative"
    },
    "number": {
      "name": "number.ttf",
      "type": "relative"
    },
    "link": {
      "name": "link.ttf",
      "type": "relative"
    },
    "race": {
      "name": "race.ttf",
      "type": "relative"
    }
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
    "spellDesc": {
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
      "tc": 'normal', "xg": 'effect', "ys": 'ritual', "rh": 'fusion', "tt": 'synchro', "cl": 'xyz', "lb": 'pendulum', "lj": 'link', "ec": 'gemini', "tz": 'tuner', "tm": 'union', "kt": 'toon', "lh": 'spirit', "fz": 'flip effect', "ts": 'special summon', "zb": 'equip', "sg": 'quick-play', "cd": 'field', "fj": 'counter', "yx": 'continuous'
    },
    "raceList": ["Dragon", "Warrior", "Fiend", "Spellcaster", "Fairy", "Zombie", "Rock", "Plant", "Insect", "Aqua", "Pyro", "Thunder", "Fish", "Sea Serpent", "Wyrm", "Dinosaur", "Reptile", "Machine", "Beast", "Winged Beast", "Beast-Warrior", "Psychic", "Cyberse", "Divine-Beast", "Divine"],
    "spell": "Spell",
    "tragic": "Trap",
    "brackets": ['[' , ']']
  }
}
