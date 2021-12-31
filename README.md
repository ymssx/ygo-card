# ygo-card

<a href="https://www.npmjs.com/package/ygo-card">
  <img src="https://img.shields.io/npm/v/ygo-card"/>
</a>

<a href="README_CN.md">中文</a>

This is a javascript SDK for rendering YU-GI-OH card. Import `ygo-card` in your website, you can easily paint the standard YU-GI-OH cards!

<a href="https://github.com/ymssx/ygo-card/wiki">DOCUMENT</a>

<div align=left>
  <img src="https://github.com/ymssx/ygo-card/blob/master/demo/幽鬼兔.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/浮幽櫻.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/灰流麗.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/屋敷童.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/儚無水木.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/朔夜時雨.jpg" width="16%" max-width="150" />
</div>

<br/>

## Usage

```shell
$ yarn add ygo-card

# or

$ npm i ygo-card -D --save
```

```typescript
import { Card } from 'ygo-card';

const canvas = document.getElementById('card');
const data = {
  name: 'Ghost Ogre & Snow Rabbit',
  _id: '59438930',
  type: 'monster',
  type2: 'effect',
  type3: 'tuner',
  attribute: 'dark',
  level: 3,
  race: 'Psychic',
  desc: 'When a monster on the field activates its effect, or when a Spell/Trap that is already face-up on the field activates its effect (Quick Effect): You can send this card from your hand or field to the GY; destroy that card on the field. You can only use this effect of "Ghost Ogre & Snow Rabbit" once per turn',
  attack: 0,
  defend: 1800,
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

<br/>