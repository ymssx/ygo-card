const MAP = {
  type: {
    131076: ['trap', 'yx', '', ''],
    17: ['monster', 'tc', '', ''],
    33554465: ['monster', 'xg', 'ts', ''],
    33: ['monster', 'xg', '', ''],
    16777249: ['monster', 'xg', 'lb', ''],
    4: ['trap', 'tc', '', ''],
    2097185: ['monster', 'xg', 'fz', ''],
    2: ['spell', 'tc', '', ''],
    65538: ['spell', 'sg', '', ''],
    4129: ['monster', 'xg', 'tz', ''],
    67108897: ['monster', 'lj', '', ''],
    16401: ['monster', 'to', '', ''],
    262146: ['spell', 'zb', '', ''],
    524290: ['spell', 'cd', '', ''],
    8225: ['monster', 'tt', '', ''],
    8388641: ['monster', 'cl', '', ''],
    131074: ['spell', 'yx', '', ''],
    97: ['monster', 'rh', '', ''],
    4113: ['monster', 'tc', 'tz', ''],
    1048580: ['trap', 'fj', '', ''],
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
    130: ['spell', 'ys', '', ''],
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
    0: "trap",
    32: "dark",
    16: "light",
    1: "earth",
    4: "fire",
    8: "wind",
    2: "water",
    64: "divine"
  },
  race: {
    16: "zombie",
    8: "fiend",
    32768: "beastwarrior",
    256: "rock",
    2: "spellcaster",
    1: "warrior",
    512: "wingedbeast",
    16384: "beast",
    32: "machine",
    4: "fairy",
    16777216: "cyberse",
    131072: "fish",
    4096: "thunder",
    128: "pyro",
    262144: "seaserpent",
    64: "aqua",
    1024: "plant",
    8192: "dragon",
    524288: "reptile",
    1048576: "psychic",
    2048: "insect",
    65536: "dinosaur",
    8388608: "wyrm",
    2097152: "divinebeast",
    4194304: "divine"
  },
  level(num) {
    if (num < 13) {
        return num;
    } else {
      const binNum = num.toString(2);
      return parseInt(binNum.substr(binNum.length - 4, binNum.length - 1), 2);
    }
  }
}


const typeMap = {
  'normal': 'tc',
  "effect": 'xg',
  "ritual": 'ys',
  "fusion": 'rh',
  "synchro": 'tt',
  "xyz": 'cl',
  "pendulum": 'lb',
  "link": 'lj',
  "gemini": 'ec',
  "tuner": 'tz',
  "union": 'tm',
  "toon": 'kt',
  "spirit": 'lh',
  "flip effect": 'fz',
  "flip-effect": 'fz',
  "special summon": 'ts',
  "special-summon": 'ts',
  "equip": 'zb',
  "quick play": 'sg',
  "quick-play": 'sg',
  "field": 'cd',
  "counter": 'fj',
  "continuous": 'yx'
}

export const variation = function(data) {
  if (Object.keys(data).length === 0) {
    return false;
  }

  let {id, atk, def, race, type, level, attribute, name, desc} = data;
  let [type1, type2, type3, type4] = MAP.type[type];
  let lb_num, lb_desc;
  attribute = MAP.attribute[attribute];
  race = MAP.race[race];
  level = MAP.level(level);
  if (type3 === "lb") {
    lb_num = parseInt(desc.substr(1));
    let temp = desc.split("→")[1];
    if (temp) {
      lb_desc = temp.split("【")[0].trim().replace(/\r?\n/g, '');;
      desc = temp.split("】")[1].trim();
    }
  }
  desc = desc.replace(/(.*?\r?\n)/g, (line, _, pos) => ['rh', 'tt', 'cl', 'lj'].includes(type2) && pos === 0 ? line : line.trim());

  atk = (atk === -2) ? '?' : atk;
  def = (def === -2) ? '?' : def;
  
  return {
    _id: String(id),
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
    desc,
    lb_num,
    lb_desc
  }
}

export const transSingleType = function(type) {
  if (typeMap[type]) {
    return typeMap[type];
  } else {
    return type;
  }
}


export const transType = function(data) {
  if (data.type2) {
    if (typeMap[data.type2]) {
      data.type2 = typeMap[data.type2];
    }
  }
  if (data.type3) {
    if (typeMap[data.type3]) {
      data.type3 = typeMap[data.type3];
    }
  }
  if (data.type4) {
    if (typeMap[data.type4]) {
      data.type4 = typeMap[data.type4];
    }
  }
  return data;
}