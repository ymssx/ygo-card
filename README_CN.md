# ygo-card

<a href="https://www.npmjs.com/package/ygo-card">
  <img src="https://img.shields.io/npm/v/ygo-card"/>
</a>

<a href="https://github.com/ymssx/ygo-card">English</a>

这是一个游戏王卡片渲染工具，你只需要在你的网站引入`ygo-card`，就可以轻松地渲染出标准的游戏王卡图！

<a href="https://gitee.com/ymssx/cardjs/wikis/HOME?sort_id=5044200">使用文档</a>

<div align=left>
  <img src="https://gitee.com/ymssx/cardjs/blob/master/demo/黑魔术少女.jpg" width="16%" max-width="150" /><img src="https://gitee.com/ymssx/cardjs/blob/master/demo/黑魔术师.jpg" width="16%" max-width="150" /><img src="https://gitee.com/ymssx/cardjs/blob/master/demo/死者苏生.jpg" width="16%" max-width="150" /><img src="https://gitee.com/ymssx/cardjs/blob/master/demo/神圣防护罩 -反射镜力-.jpg" width="16%" max-width="150" /><img src="https://gitee.com/ymssx/cardjs/blob/master/demo/元素英雄 神·新宇侠.jpg" width="16%" max-width="150" /><img src="https://gitee.com/ymssx/cardjs/blob/master/demo/流天类星龙.jpg" width="16%" max-width="150" />
</div>

<br/>

## 基本使用

```shell
$ yarn add ygo-card

# 或者

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
  attribute: 'light',
  level: 3,
  race: '念动力族',
  desc: `这个卡名的效果1回合只能使用1次。
①：场上的怪兽的效果发动时或者场上的已是表侧表示存在的魔法·陷阱卡的效果发动时，把自己的手卡·场上的这张卡送去墓地才能发动。场上的那张卡破坏。`,
  attack: 0,
  defend: 1800,
};

const card = new Card({ data, canvas, moldPath: './dist/mold'});
card.render();
```

<br/>

## 使用文档

<a href="https://github.com/ymssx/ygo-card/wiki">文档</a>

<br/>

## DEMO

[🔗 游戏王在线制卡器  #yami](https://ymssx.github.io/ygo/)

[🔗 一次性生成卡组PDF #yami](https://github.com/msk86/ygo-card-print)

<br/>