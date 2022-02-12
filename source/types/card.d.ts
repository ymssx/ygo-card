type CardBaseType = 'monster' | 'spell' | 'trap';

type CardSubTypeCn = 'tc' | 'xg' | 'ys' | 'rh' | 'tt' | 'cl' | 'lb' | 'lj';
type CardSubTypeEn = 'normal' | 'effect' | 'ritual' | 'fusion' | 'synchro' | 'xyz' | 'pendulum' | 'link';
type CardSubType = CardSubTypeEn;

type MonsterOtherTypeCn = 'tc' | 'xg' | 'ec' | 'tz' | 'tm' | 'tk' | 'lh' | 'fz' | 'ts';
type MonsterOtherTypeEn = 'normal' | 'effect' | 'gemini' | 'tuner' | 'union' | 'toon' | 'spirit' | 'flip-effect' | 'special-summon';
type MonsterOtherType = MonsterOtherTypeEn;

type SpellTypeCn = 'tc' | 'fj' | 'yx';
type SpellTypeEn = 'normal' | 'counter' | 'continuous';
type SpellType = SpellTypeEn;

type TrapTypeCn = 'tc' | 'zb' | 'sg' | 'cd' | 'yx';
type TrapTypeEn = 'normal' | 'equip' | 'quick-play' | 'field' | 'continuous';
type TrapType = TrapTypeEn;

type CardType = MonsterOtherType | SpellType | TrapType;

type AttributeType = 'light' | 'dark' | 'fire' | 'water' | 'wind' | 'earth' | 'divine';

interface CardData {
  name: string;
  _id: string;
  types?: [CardBaseType, CardSubType] | [CardBaseType, CardSubType, CardType] | [CardBaseType, CardSubType, CardType, CardType];
  type: CardBaseType;
  type2: CardSubType;
  type3?: CardType;
  type4?: CardType;
  desc: string;
  attribute?: AttributeType;
  race?: string;
  attack?: number;
  defend?: number;
  level?: number;
  link?: boolean[];
  lb_desc?: string;
  lb_number?: number;
}

interface CardProps {
  data: CardData;
  canvas: HTMLCanvasElement;
  size: [number, number];
  moldPath?: string;
  lang?: string;
  config?: Object;
  getPic?: (id: string) => string;
  fontLoaded?: Function;
  imageLoaded?: Function;
  fontsLoaded?: Function;
  imagesLoaded?: Function;
  picLoaded?: Function;
  loaded?: Function;
  recover?: boolean;
  holo?: boolean;
  copyright?: string;
  cardbagSwitch?: boolean;
  passwordSwitch?: boolean;
  translate?: boolean;
  verbose?: boolean;
  autoResize?: boolean;
}

export class Card {
  constructor(props: CardProps);

  render: () => Promise<void>;

  clearFlash: () => void;
  
  feed: (img: HTMLImageElement, imgStatus: boolean) => void;

  changeConfig: (config: Object) => void;

  draw: (size: [number, number], config: Object) => {};

  save: (saveName: string, size: [number, number]) => Promise<void>;

  feedData: (data: CardData) => {};

  feedFlash: (img: HTMLImageElement) => void;

  transData: (data: Object) => Object;

  complex: (data: Object) => Object;

  readYDK: (ydk: string) => [string[], string[], string[]];
}