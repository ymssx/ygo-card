export enum CardBaseType {
  monster = 'monster',
  spell = 'spell',
  trap = 'trap',
}

export enum CardType {
  tc = 'tc',
  xg = 'xg',
  ys = 'ys',
  rh = 'rh',
  tt = 'tt',
  cl = 'cl',
  lj = 'lj',
  lb = 'lb',
  tk = 'tk',
  null = '',
}

export enum Attribute {
  light = 'light',
  dark = 'dark',
  fire = 'fire',
  water = 'water',
  wind = 'wind',
  earth = 'earth',
  divine = 'divine',
}

export interface CardData {
  name: string;
  _id: string;
  type: CardBaseType;
  type2: CardType;
  type3: CardType;
  type4: CardType;
  desc: string;
  attribute?: Attribute;
  race?: string;
  attack?: number;
  defend?: number;
  level?: number;
  link?: boolean[];
  lb_desc?: string;
  lb_number?: number;
}

export interface Card {
  feed: Function;
  feedData: Function;
  data: CardData;
  changeConfig: Function;
}
export interface CardColorItem {
  color: string;
  label: string;
  value: {
    type: CardBaseType;
    type2?: CardType;
    type3?: CardType;
  }
}

export const CardColor: CardColorItem[] = [
  {
    color: '#008b74',
    label: '魔法',
    value: {
      type: CardBaseType.spell,
    }
  },
  {
    color: '#b12e8b',
    label: '陷阱',
    value: {
      type: CardBaseType.trap,
    }
  },
  {
    color: '#be704a',
    label: '效果',
    value: {
      type: CardBaseType.monster,
      type2: CardType.xg,
    }
  },
  {
    color: '#d8bd76',
    label: '通常',
    value: {
      type: CardBaseType.monster,
      type2: CardType.tc,
    }
  },
  {
    color: '#3f78bf',
    label: '仪式',
    value: {
      type: CardBaseType.monster,
      type2: CardType.ys,
    }
  },
  {
    color: '#7a3e98',
    label: '融合',
    value: {
      type: CardBaseType.monster,
      type2: CardType.rh,
    }
  },
  {
    color: '#ddd',
    label: '同调',
    value: {
      type: CardBaseType.monster,
      type2: CardType.tt,
    }
  },
  {
    color: 'black',
    label: '超量',
    value: {
      type: CardBaseType.monster,
      type2: CardType.cl,
    }
  },
  {
    color: '#284a78',
    label: '连接',
    value: {
      type: CardBaseType.monster,
      type2: CardType.lj,
    }
  },
  {
    color: '#7b716f',
    label: '衍生物',
    value: {
      type: CardBaseType.monster,
      type2: CardType.tk,
    }
  },
];

export const AttributeList = [
  Attribute.light,
  Attribute.dark,
  Attribute.wind,
  Attribute.water,
  Attribute.fire,
  Attribute.earth,
  Attribute.divine,
];

export const AttributeCn = {
  [Attribute.light]: '光',
  [Attribute.dark]: '暗',
  [Attribute.wind]: '风',
  [Attribute.water]: '水',
  [Attribute.fire]: '炎',
  [Attribute.earth]: '地',
  [Attribute.divine]: '神',
};

export const AttributeColor = {
  [Attribute.light]: 'gold',
  [Attribute.dark]: '#785ba2',
  [Attribute.wind]: '#72bb53',
  [Attribute.water]: '#11abe5',
  [Attribute.fire]: 'red',
  [Attribute.earth]: 'black',
  [Attribute.divine]: '#7c6439',
};

export enum Lang {
  cn = 'cn',
  cnSimplify = 'cn-simplify',
  jp = 'jp',
  jpNotation = 'jp-notation',
  en = 'en',
}
