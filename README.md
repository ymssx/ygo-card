# ygo-card

<a href="https://www.npmjs.com/package/ygo-card">
  <img src="https://img.shields.io/npm/v/ygo-card"/>
</a>

<a href="README_CN.md">中文</a>

<a href="https://github.com/ymssx/ygo-card/wiki">DOCUMENT</a>

This is a javascript SDK for rendering YU-GI-OH card. import `ygo-card` in your website, you can easily paint the standard YU-GI-OH cards!

<br/>

## Usage

```typescript
import { Card } from 'ygo-card';

const canvas = document.getElementById('card');
const data = {
  name: '幽鬼兔',
  _id: '59438930',
  type: 'monster',
  type2: 'xg',
  type3: 'tz',
  type4: '',
  attack: 0,
  defend: 1800,
  level: 3,
  desc: '「浮幽櫻」的效果1回合只能使用1次。\n' +
    '①：對方場上的怪獸數量比自己場上的怪獸多的場合，把這張卡從手卡丟棄才能發動。選自己的額外卡組1張卡給雙方確認。那之後，把對方的額外卡組確認，有選的卡的同名卡的場合，那些對方的同名卡全部除外。這個效果在對方回合也能發動。',
  race: '不死族',
  attribute: 'dark'
};

const card = new Card({ data, canvas, moldPath: './dist/mold'});
card.render();
```

<br/>

## Document

<a href="https://github.com/ymssx/ygo-card/wiki">DOCUMENT</a>

<br/>

## DEMO

[🔗 DIY ONLINE  #yami](https://ymssx.github.io/ygo/)

[🔗 Yu-Gi-Oh WIKI #yami](http://ocg.wiki/#59438930)

<a href="http://ocg.wiki/#59438930" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/幽鬼兔.jpg" height="200" /></a><a href="http://ocg.wiki/#62015408" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/浮幽櫻.jpg" height="200" /></a><a href="http://ocg.wiki/#14558127" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/灰流麗.jpg" height="200" /></a><a href="http://ocg.wiki/#73642296" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/屋敷童.jpg" height="200" /></a><a href="http://ocg.wiki/#60643553" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/儚無水木.jpg" height="200" /></a><a href="http://ocg.wiki/#52038441" target="blank"><img src="https://github.com/ymssx/ygo-card/blob/master/demo/朔夜時雨.jpg" height="200" /></a>

<br/>