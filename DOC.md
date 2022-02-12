# ygo-card 文档

<a href="https://www.npmjs.com/package/ygo-card">
  <img src="https://img.shields.io/npm/v/ygo-card"/>
</a>

这是一个游戏王卡片渲染工具，你只需要在你的网站引入ygo-card，就可以轻松地渲染出标准的游戏王卡图！

<a href="https://github.com/ymssx/ygo-card">github</a> | 
<a href="https://gitee.com/ymssx/cardjs">gitee</a>

## 为什么使用ygo-card

你的网站需要展示游戏王卡图，但是网上的图片资源质量参差不齐？ygo-card可以方便的渲染出标准、高清的游戏王卡图。

* 响应式。我们会自动响应数据的变动，同时更新卡图，这在与表单交互场景十分有用。

* 交互式。你可以实现各种交互动效，比如SR面闪特效、烫金字等。同时允许实时修改卡片信息、自由定制卡片。

* 高质量。ygo-card生成的卡图足够清晰，可以直接用于打印。我们的卡图排版会严格和官方保持一致。

<br/>

## 作品

- <a href="https://ymssx.gitee.io/ygo">游戏王在线制卡器<a>

- <a href="https://github.com/msk86/ygo-card-print">一次性打印卡组</a>

欢迎向我自荐你的基于ygo-card的作品，邮箱：ymssx@qq.com

<div align=left>
  <img src="https://github.com/ymssx/ygo-card/blob/master/demo/黑魔术少女.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/黑魔术师.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/死者苏生.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/神圣防护罩 -反射镜力-.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/元素英雄 神·新宇侠.jpg" width="16%" max-width="150" /><img src="https://github.com/ymssx/ygo-card/blob/master/demo/流天类星龙.jpg" width="16%" max-width="150" />
</div>

<br/>

## 安装

* ### npm安装

```sh
$ npm i ygo-card -D --save
```

或者使用yarn

```sh
$ yarn add ygo-card
```

在项目中引用

```js
// commonjs
const { Card } = require('ygo-card');
// es module
import { Card } from 'ygo-card';
```


**你可以手动复制node_modules/ygo-card/dist/mold文件夹到你的静态资源处，并在后续指定mold的路径**

* ### 手动引入

```shell
$ git clone https://github.com/ymssx/ygo-card
```

将`dist`文件夹的内容放在合适的位置，使用`<script>`引入index.js

``` html
<canvas id="card"></canvas>
...
<script src="xxx/index.js"></script>
```

#### 目录结构

* `mold/`

保存了我们需要的标准模板素材。当然你也可以自定义你的模板

* `config/`

这里自带了几份常用的配置文件

* `index.js`

手动引入它就可以使用Card啦

<br/>

## 基本使用

传入一个卡片数据和canvas元素，然后使用render方法就可以渲染啦

```javascript
// canvas的dom节点
const canvas = document.getElementById('card');
// 卡片数据的描述
const data = { 
  name: '青眼的白龍',
  _id: '89631139',
  type: 'monster',
  type2: 'tc',
  type3: '',
  type4: '',
  attack: 3000,
  defend: 2500,
  level: 8,
  desc: '以高攻擊力著稱的傳說之龍。任何對手都能被粉碎，其破壞力不可估量。',
  race: '龍族',
  attribute: 'light' 
}

const card = new Card({ data, canvas, size: [400, 584] });
// render之后canvas会被渲染出卡图
card.render();
```

恭喜你，一张青眼白龙就渲染出来啦

**注意，当mold文件夹不在根目录时，你可能需要在moldPath手动指定mold文件夹的路径。或者直接设置 ```moldPath: './node_modules/ygo-card/dist/mold'```**

```javascript
const card = new Card({ data, canvas, moldPath: './assets/mold' });
```

  *事实上，一个完整的中文/日文字体可能需要耗费大量的加载时间，导致网站初始加载变慢。所以我强烈推荐使用font-spider或者fontmin根据需要进行字体压缩。*

<br/>

### data: CardData -- 卡片信息，包括名字、密码、效果等

```ts
interface CardData {
  name: string;                          // card name
  _id: string;                           // card id
  type: 'monster' | 'spell' | 'trap';    // first type
  type2: type;                           // secend type 见下面注释①
  type3: type;                           // third type
  type4: type;                           // fourth type
  desc: string;                          // card describe
  attribute?: 'light' | 'dark' | 'fire' | 'water' | 'wind' | 'earth' | 'divine';
                                         // monster attribute
  race?: string;                         // monster race
  attack?: number;                       // monster attack
  defend?: number;                       // monster defend
  level?: number;                        // monster level

  link?: boolean[];                      // link monster arrows
  lb_desc?: string;                      // pendulum describe
  lb_number?: number;                    // pendulum number
}
```

| tc | xg | ys | rh | tt | cl | lb | lj | ec | tz | tm | kt | lh | fz | ts | zb | sg | cd | fj | yx |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 通常  | 效果 | 儀式 | 融合 | 同調 | 超量 | 靈擺 | 連接 | 二重 | 調整 | 同盟 | 卡通 | 靈魂 | 反轉 | 特殊召喚 | 裝備 | 速攻 | 場地 | 反擊 | 永續 |

#### ① 关于type2 | type3 | type4
* 如果你的项目在使用Typescript，那么我们的自动补全提示会自动告诉你怎么填写这几项。
* 描述卡片类型时，请一定在type2中反映出它是一张什么颜色的卡片，可选为 tc通常、xg效果、rh融合、ys仪式、cl超量、tt同调等
* type3 - type4可描述为tz调整、ec二重、fz反转、tc通常、xg效果等
* 默认使用拼音首字母描述，超过两个字的按前两个字处理，如“特殊召唤”为“ts”
* TCG玩家也可以使用英文，如 normal、effect、fusion、ritual、xyz、synchro等（请使用小写），我们会自动转换为拼音

以下两种描述是等价的，请根据自己喜好选择

```javascript
const data = { 
  name: '幽鬼兔',
  type: 'monster',
  type2: 'xg', // 效果
  type3: 'tz', // 调整
  type4: '',
}

const data = { 
  name: '幽鬼兔',
  type: 'monster',
  type2: 'effect', // 效果
  type3: 'tuner', // 调整
  type4: '',
}
```

<br/>

## 🎏 游戏王卡图库

不知道去哪里找卡图？

这里收录了绝大多数游戏王卡图，不定期更新。

<a href="https://gitee.com/ymssx/pics">游戏王卡图库</a>


<a href="http://ocg.wiki/#21844576" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/21844576.jpg" height="120" /></a>
<a href="http://ocg.wiki/#58932615" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/58932615.jpg" height="120" /></a>
<a href="http://ocg.wiki/#84327329" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/84327329.jpg" height="120" /></a>
<a href="http://ocg.wiki/#20721928" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/20721928.jpg" height="120" /></a>
<a href="http://ocg.wiki/#79979666" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/79979666.jpg" height="120" /></a>

<br/>
 
## 详细配置
 
```typescript
const Card = function ({
  data: CardData,                         // 卡片数据
  canvas: HTMLElement,                    // canvas对象
  size: number[],                         // 绘制尺寸，[宽, 高]
  moldPath: string = './mold',            // 模板资源路径
  lang: 'cn' | 'jp' | 'en' = 'cn',        // 语言 cn、jp、en
  config: object = defaultConfig,         // 配置信息。在这里指定你的自定义配置信息
  getPic: id => imgUrl,                   // 描述如何通过id获取卡图的函数
  fontLoaded: function = defaultEvent,    // 事件
  imageLoaded: function = defaultEvent,
  fontsLoaded: function = defaultEvent,
  imagesLoaded: function = defaultEvent,
  picLoaded: function = defaultEvents,
  loaded: function = defaultEvent,
  recover: boolean = false,               // 是否缓存配置与数据
  holo: boolean = true,                   // 是否显示防伪标志
  cardbagSwitch: boolean = false,         // 是否渲染卡包信息
  translate: boolean = false,             // 是否自动繁简转换,默认字体繁简同体，不需要打开
  verbose: boolean = false,               // 是否开启console
})
```

<br/>

### size

当传入的值为数组时，canvas会严格按照这个尺寸进行绘制。

```javascript
const card = new Card({ data, canvas, size = [813, 1185] })
```

你也可以不传入size，如果autoResize为true（默认值），那么card.js会自动计算尺寸。

当canvas尺寸变化时，card.js会自动重新进行绘制，保证卡图永远高清，这在弹性布局中十分有用。

```html
<style>
#card {
  width: 80%;
}
</style>

<canvas id="card"></canvas>
```

```javascript
// autoResize默认开启
const card = new Card({ data, canvas, autoResize: true })
```

<br/>

## 生命周期

通过传入事件来自定义卡片渲染的生命周期钩子函数。

### fontLoaded

单个字体文件加载完成。

```javascript
card.fontLoaded = function(e) {
  console.log(e);
}
 ```
 
### fontsLoaded

所有字体文件加载完成。

### imageLoaded

单个图片资源加载完成。

### imagesLoaded

单个图片资源加载完成。

### picLoaded

中间卡图加载完成。

### loaded

卡片渲染完毕。

<br/>
 
## config

更改config文件，可以自由地调整卡片的样式，比如字体大小、颜色等。

[具体配置请参考`config/defaultConfig.js`](https://gitee.com/ymssx/cardjs/tree/master/source/config)

你可以通过传递一个配置对象来临时改变配置信息

```javascript
card.changeConfig(config);
```

<br/>

## API

### Card.render

```javascript
await card.render();
```

初始渲染，返回一个promise对象，当绘制完毕时变为fulfilled状态。

### Card.feed

你可以自由的使用与更换自定义的中间卡图。

比如当你想把【真红眼黑龙】的卡图换成【青眼白龙】。
```javascript
const pic = document.getElementById('blueEyes');
card.feed(pic);
```

### Card.changeConfig

```javascript
card.changeConfig(config);
```

### Card.feedData

调整卡片信息。

```javascript
card.feedData(data);
```

或者直接
```javascript
card.data.name = 'Blue Eyes';
```

### Card.save

保存卡图到本地，你可以指定保存时**文件名称**和**图片尺寸**。
```javascript
card.save('青眼白龙', [1626, 2370]);
```
也可以不指定参数，card.js会自动使用卡名作为文件名，尺寸会使用默认值1626 × 2370。

### Card.feedFlash

使用面闪效果。传入一张闪面卡图，并且调整`card.data.flash`的值（0 ~ 1），卡图会呈现不同强度的面闪效果。

值得注意的是，中间卡图在被更换之后会自动清除所有的闪面图设置。你最好在`picLoaded`事件中使用这个api，否则闪面效果可能无法显示。

```js
const card = new Card({
  picLoaded() {
    card.feedFlash(document.getElementById('flashImg'));
    card.data.flash = 0.5;
  },
})
```

<br/>

## 静态方法

以下是Card类的方法，请不要在实例对象上使用。

### Card.complex

将简体字文本转换为繁体字文本。

```javascript
const complexText = Card.complex('青眼白龙'); // 青眼白龍
```

### Card.transData

card.js需要你以特定的JSON结构来描述一张卡，觉得麻烦？没关系，使用transData可以**直接兼容YGOPro自带数据库的卡片数据**。

```javascript
const ygoproData = {
  "name": '元素英雄 羽翼侠',
  "desc": "拥有操纵风在天空飞舞之翼的元素英雄。以来自天空的一击羽翼击破来审判邪恶。",
  "id": 21844576,
  "atk": 1000,
  "def": 1000,
  "race": 1,
  "type": 17,
  "level": 3,
  "attribute": 8
}
// 来自YGOPro的数据，直接传入card.js会报错
const newData = Card.transData(ygoproData);
console.log(newData);
```

输出

```javascript
{
  name: '元素英雄 羽翼侠',
  desc: '拥有操纵风在天空飞舞之翼的元素英雄。以来自天空的一击羽翼击破来审判邪恶。',
  _id: '21844576',
  attack: 1000,
  defend: 1000,
  race: '战士族',
  type: 'monster',
  type2: 'tc',
  type3: '',
  type4: '',
  level: 3,
  attribute: 'wind'
}
// 可以被card.js理解的数据对象结构
```

<br/>

## 实现方式

Card.js

* cardData.js 

管理卡片数据，监听数据变动，当数据更新之后，cardData会自动分析需要更新哪些文件，然后告知cardFile

* cardFile.js

管理文件的更新与缓存，当收到cardData的更新请求后，会自动从缓存或者网络调用图片，在文件更新之后会自动告知cardDrawer

* cardDrawer.js

管理绘图功能，在收到cardFile的绘图请求后，会按照cardData的数据以及cardFile提供的文件进行绘图

<br />

## 在React中使用

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'ygo-card';

const YgoCard = ({ data, onCreated, onLoaded }) => {
  const [cardIns, setCardIns] = useState();
  const canvas = useRef(null);

  useEffect(() => {
    const newCardIns = = new Card({
      data,
      size: [813, 1185],
      canvas: canvas.current,
      moldPath: '/mold',
      fontsLoaded: onLoaded,
    });

    setCardIns(newCardIns);

    newCard.render();

    if (onCreated instanceof Function) {
      onCreated(newCard);
    }
  }, [canvas]);

  useEffect(() => {
    cardIns?.feedData(data);
  }, [data]);

  return (
    <canvas ref={canvas} />
  );
};

// 引用
const BlueEyes = () => <YgoCard data={ name: '青眼白龙', attack: 3000 } />;
```

<br />

## 在node上进行服务端渲染

事实上，完全在前端进行卡图渲染也有缺点，中文字体过于庞大而导致网页需要预先加载大量资源之后才能渲染出卡图。
所以，cardjs现在也支持在node上进行卡图渲染。

### 使用方式

参考 <a href="#安装">#安装</a>

区别是引入的文件不同

#### npm安装

```js
import { CardNode, getCard } from 'ygo-card';
```

#### 使用

```js
const card = await getCard(
  data, // 卡片数据
  {
    size: size, // 尺寸
    moldPath: '/public/mold/', // mold文件夹的路径（重要）
    picPath: `/public/pics/500/${id}.jpg`, // 图片集的路径
  },
);

// getCard返回二进制图片数据
```

这是一张服务端实时渲染的卡图

<img src="http://115.159.193.88:1803/cardpic?id=62015408&size=400" />