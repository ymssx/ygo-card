const MAP = {
  type: {
    131076: ['tragic', 'yx', '', ''],
    17: ['monster', 'tc', '', ''],
    33554465: ['monster', 'xg', 'ts', ''],
    33: ['monster', 'xg', '', ''],
    16777249: ['monster', 'xg', 'lb', ''],
    4: ['tragic', 'tc', '', ''],
    2097185: ['monster', 'xg', 'fz', ''],
    2: ['magic', 'tc', '', ''],
    65538: ['magic', 'sg', '', ''],
    4129: ['monster', 'xg', 'tz', ''],
    67108897: ['monster', 'lj', '', ''],
    16401: ['monster', 'to', '', ''],
    262146: ['magic', 'zb', '', ''],
    524290: ['magic', 'cd', '', ''],
    8225: ['monster', 'tt', '', ''],
    8388641: ['monster', 'cl', '', ''],
    131074: ['magic', 'yx', '', ''],
    97: ['monster', 'rh', '', ''],
    4113: ['monster', 'tc', 'tz', ''],
    1048580: ['tragic', 'fj', '', ''],
    65: ['monster', 'rh', 'tc', ''],
    33558561: ['monster', 'xg', 'tz', 'ts'],
    545: ['monster', 'xg', 'nm', ''],
    1057: ['monster', 'xg', 'tm', ''],
    129: ['monster', 'ys', 'tc', ''],
    161: ['monster', 'ys', '', ''],
    2081: ['monster', 'xg', 'ec', ''],
    50331681: ['monster', 'xg', 'lb', 'ts'],
    4194337: ['monster', 'xg', 'kt', ''],
    16777233: ['monster', 'tc', 'lb', ''],
    130: ['magic', 'ys', '', ''],
    8388609: ['monster', 'cl', 'tc', ''],
    16781345: ['monster', 'xg', 'lb', 'tz'],
    12321: ['monster', 'tt', 'tz', ''],
    16777313: ['monster', 'rh', 'lb', ''],
    8193: ['monster', 'tt', 'tc', ''],
    25165857: ['monster', 'cl', 'lb', ''],
    18874401: ['monster', 'xg', 'lb', 'fz'],
    673: ['monster', 'ys', 'lh', ''],
    2101281: ['monster', 'xg', 'fz', 'tz'],
    37748769: ['monster', 'xg', 'kt', 'ts'],
    16777761: ['monster', 'xg', 'lb', 'lh'],
    67108865: ['monster', 'lj', 'tc', ''],
    16785441: ['monster', 'tt', 'lb', ''],
    16781329: ['monster', 'tc', 'lb', 'tz'],
    5153: ['monster', 'xg', 'tm', 'tz'],
    33554977: ['monster', 'xg', 'lh', 'ts'],
    4161: ['monster', 'rh', 'tz', 'tc']
  },
  attribute: {
    0: "tragic",
    32: "dark",
    16: "light",
    1: "ground",
    4: "fire",
    8: "wind",
    2: "water",
    64: "god"
  },
  race: {
    16: "不死族",
    8: "恶魔族",
    32768: "兽战士族",
    256: "岩石族",
    2: "魔法师族",
    1: "战士族",
    512: "鸟兽族",
    16384: "兽族",
    32: "机械族",
    4: "天使族",
    16777216: "电子界族",
    131072: "鱼族",
    4096: "雷族",
    128: "炎族",
    262144: "海龙族",
    64: "水族",
    1024: "植物族",
    8192: "龙族",
    524288: "爬虫族",
    1048576: "念动力族",
    2048: "昆虫族",
    65536: "恐龙族",
    8388608: "幻龙族",
    2097152: "幻神兽族",
    4194304: "创造神族"
  },
  level(num) {
    if (num < 13) {
        return num;
    } else {
      let binNum = num.toString(2);
      let avaiablePart = binNum.subStr(binNum.length - 4, binNum.length - 1);
      return avaiablePart;
    }
  }
}


export default function({id, atk, def, race, type, level, attribute, name, desc}) {
  let [type1, type2, type3, type4] = MAP.type[type];
  attribute = MAP.attribute[attribute];
  race = MAP.race[race];
  level = MAP.level(level);

  atk = (atk === -2) ? '?' : atk;
  def = (def === -2) ? '?' : def;
  
  return {
    _id: id,
    name,
    type: type1,
    type2: type2,
    type3: type3,
    type4: type4,
    attack: atk,
    defend: def,
    race,
    level,
    attribute,
    desc
  }
}