const MAP = {
  type: {
    2: ['spell', 'tc', '', ''],
    4: ['trap', 'tc', '', ''],
    17: ['monster', 'tc', '', ''],
    33: ['monster', 'xg', '', ''],
    65: ['monster', 'rh', 'tc', ''],
    97: ['monster', 'rh', '', ''],
    129: ['monster', 'ys', 'tc', ''],
    130: ['spell', 'ys', '', ''],
    161: ['monster', 'ys', '', ''],
    545: ['monster', 'xg', 'nm', ''],
    673: ['monster', 'ys', 'lh', ''],
    1057: ['monster', 'xg', 'tm', ''],
    2081: ['monster', 'xg', 'ec', ''],
    8193: ['monster', 'tt', 'tc', ''],
    8225: ['monster', 'tt', '', ''],
    4113: ['monster', 'tc', 'tz', ''],
    4129: ['monster', 'xg', 'tz', ''],
    4161: ['monster', 'rh', 'tz', 'tc'],
    5153: ['monster', 'xg', 'tm', 'tz'],
    12321: ['monster', 'tt', 'tz', ''],
    16401: ['monster', 'to', '', ''],
    65538: ['spell', 'sg', '', ''],
    131074: ['spell', 'yx', '', ''],
    131076: ['trap', 'yx', '', ''],
    262146: ['spell', 'zb', '', ''],
    524290: ['spell', 'cd', '', ''],
    1048580: ['trap', 'fj', '', ''],
    2097185: ['monster', 'xg', 'fz', ''],
    2101281: ['monster', 'xg', 'fz', 'tz'],
    4194337: ['monster', 'xg', 'kt', ''],
    8388609: ['monster', 'cl', 'tc', ''],
    8388641: ['monster', 'cl', '', ''],
    16777249: ['monster', 'xg', 'lb', ''],
    16777233: ['monster', 'tc', 'lb', ''],
    16777313: ['monster', 'rh', 'lb', ''],
    16777761: ['monster', 'xg', 'lb', 'lh'],
    16781329: ['monster', 'tc', 'lb', 'tz'],
    16781345: ['monster', 'xg', 'lb', 'tz'],
    16785441: ['monster', 'tt', 'lb', ''],
    18874401: ['monster', 'xg', 'lb', 'fz'],
    25165857: ['monster', 'cl', 'lb', ''],
    33554465: ['monster', 'xg', 'ts', ''],
    33554977: ['monster', 'xg', 'lh', 'ts'],
    33558561: ['monster', 'xg', 'tz', 'ts'],
    37748769: ['monster', 'xg', 'kt', 'ts'],
    50331681: ['monster', 'xg', 'lb', 'ts'],
    67108865: ['monster', 'lj', 'tc', ''],
    67108897: ['monster', 'lj', '', ''],
  },
  attribute: {
    0: "trap",
    1: "earth",
    2: "water",
    4: "fire",
    8: "wind",
    16: "light",
    32: "dark",
    64: "divine",
  },
  race: {
    1: "warrior",
    2: "spellcaster",
    4: "fairy",
    8: "fiend",
    16: "zombie",
    32: "machine",
    64: "aqua",
    128: "pyro",
    256: "rock",
    512: "wingedbeast",
    1024: "plant",
    2048: "insect",
    4096: "thunder",
    8192: "dragon",
    16384: "beast",
    32768: "beastwarrior",
    65536: "dinosaur",
    131072: "fish",
    262144: "seaserpent",
    524288: "reptile",
    1048576: "psychic",
    2097152: "divinebeast",
    4194304: "divine",
    8388608: "wyrm",
    16777216: "cyberse",
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
      lb_desc = temp.split("【")[0].trim().replace(/\r?\n/g, '');
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

export const formatData = (rawData) => {
  const readableData = variation(rawData);
  
};

export const transSingleType = function(type) {
  if (typeMap[type]) {
    return typeMap[type];
  } else {
    return type;
  }
}


export const transType = function(originData) {
  const data = {
    ...originData,
  };

  if (Array.isArray(data.types)) {
    data.type = data.types[0];
    data.type2 = data.types[1];
    data.type3 = data.types[2];
    data.type4 = data.types[3];
  }

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