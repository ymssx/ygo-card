type CardType = 'tc' | 'xg' | 'ys' | 'rh' | 'tt' | 'cl' | 'lb' | 'lj' | 'ec' | 'tz' | 'tm' | 'tk' | 'lh' | 'fz' | 'ts' | 'zb' | 'sg' | 'cd' | 'fj' | 'yx';

interface CardData {
  name: string;
  _id: string;
  type: 'monster' | 'spell' | 'trap';
  type2: CardType;
  type3?: CardType;
  type4?: CardType;
  desc: string;
  attribute?: 'light' | 'dark' | 'fire' | 'water' | 'wind' | 'earth' | 'divine';
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

  feedData: (data: { [key: string]: string | number }) => {};

  feedFlash: (img: HTMLImageElement) => void;

  transData: (data: Object) => Object;

  complex: (data: Object) => Object;

  readYDK: (ydk: string) => [string[], string[], string[]];
}