# card.js

<img src="https://img.shields.io/npm/v/ygo-card"/>
<img src="https://img.shields.io/npm/l/ygo-card"/>
<img src="https://img.shields.io/badge/yami-%40qq.com-lightgrey"/>

这是一个游戏王卡片渲染工具，你只需要在你的网站引入card.js，就可以轻松地渲染出标准的游戏王卡图！

## 为什么使用card.js

你的网站需要大量的游戏王卡图，但是网上的卡图资源参差不齐？不妨试试card.js，只需要一次的加载，就可以使用快速、大量、标准、高清的游戏王卡图。

* 🍇 对于海量高清卡图的场景，相比于直接下载完整的图片，card.js只需要下载中间卡图进行前端渲染，整体加载非常迅速，节省了大量带宽。

* 🍉 card.js支持复杂的交互动效，比如SR面闪特效、烫金字等。同时允许实时修改卡片信息、自由定制卡片。

* 🥦 card.js会追踪数据的变动，自动地更新卡图，这在与表单交互场景十分有用。同时，对于大量的图片更新请求，card.js只会进行一次绘制，因此你不用过多的担心性能问题。

* 🍅 card.js十分容易使用，你只需要短短的一行代码，就能将一张canvas画布变成一张游戏王高清卡图！另外，card.js可以自由的更改模板样式，在config文件中你可以随心所欲地进行创作！

<br/>
<br/>

## 🎈 作品

[🔗 游戏王在线制卡器  #yami](https://ymssx.gitee.io/ygo)

[🔗 游戏王WIKI #yami](http://ocg.wiki/#59438930)

欢迎向我自荐你的基于card.js的作品，邮箱：ymssx@qq.com

<a href="http://ocg.wiki/#59438930" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/幽鬼兔.jpg" height="200" /></a>
<a href="http://ocg.wiki/#62015408" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/浮幽櫻.jpg" height="200" /></a>
<a href="http://ocg.wiki/#14558127" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/灰流麗.jpg" height="200" /></a>
<a href="http://ocg.wiki/#73642296" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/屋敷童.jpg" height="200" /></a>
<a href="http://ocg.wiki/#60643553" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/儚無水木.jpg" height="200" /></a>
<a href="http://ocg.wiki/#52038441" target="blank"><img src="https://gitee.com/ymssx/cardjs/raw/master/demo/朔夜時雨.jpg" height="200" /></a>

<br/>
<br/>

## 📦 安装

```shell
$ git clone https://gitee.com/ymssx/cardjs.git
```

或者
```shell
$ npm i ygo-card
```

<br/>
<br/>

## 🚀 使用方式

将card.js所在的文件夹放在合适的位置，在js中使用import的方式引入card.js

``` html
<canvas id="card"></canvas>
```

```javascript
import Card from './card.js';

const canvas = document.getElementById('card');
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

card.render();
```

**注意**，当card.js不在根目录时，你可能需要手动指定moldPath （末尾不要加"/"）。

```javascript
const card = new Card({ data, canvas, moldPath: './source/mold' });
```

<br/>

> ### data -- 卡片信息，包括名字、密码、效果等

```typescript
interface data = {
  name: string,                          // card name
  _id: string,                           // card id
  type: 'monster' | 'magic' | 'tragic',  // first type
  type2: type,                           // secend type
  type3: type,                           // third type
  type4: type,                           // fourth type
  desc: string                           // card describe
  ?attribute: 'light' | 'dark' | 'fire' | 'water' | 'wind' | 'ground' | 'god'
                                         // monster attribute
  ?race: string                          // monster race
  ?attack: number                        // monster attack
  ?defend: number                        // monster defend
  ?level: number                         // monster level

  ?link: boolean[]                       // link monster arrows
  ?lb_desc: string                       // pendulum describe
  ?lb_number: number                     // pendulum number
}

typeMap = { "tc": '通常', "xg": '效果', "ys": '儀式', "rh": '融合', "tt": '同調', "cl": '超量', "lb": '靈擺', "lj": '連接', "ec": '二重', "tz": '調整', "tm": '同盟', "tk": '卡通', "lh": '靈魂', "fz": '反轉', "ts": '特殊召喚', "zb": '裝備', "sg": '速攻', "cd": '場地', "fj": '反擊', "yx": '永續' }
```

<br/>
<br/>

## 🎏 游戏王卡图库

不知道去哪里找卡图？

这里收录了绝大多数游戏王卡图，不定期更新。

[🔗 传送门](https://gitee.com/ymssx/pics)


<a href="http://ocg.wiki/#21844576" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/21844576.jpg" height="150" /></a>
<a href="http://ocg.wiki/#58932615" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/58932615.jpg" height="150" /></a>
<a href="http://ocg.wiki/#84327329" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/84327329.jpg" height="150" /></a>
<a href="http://ocg.wiki/#20721928" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/20721928.jpg" height="150" /></a>
<a href="http://ocg.wiki/#79979666" target="blank"><img src="https://gitee.com/ymssx/pics/raw/master/500/79979666.jpg" height="150" /></a>

<br/>
<br/>
 
## 🎉 详细配置
 
```typescript
const Card = function ({
  data: object,                           // 卡片数据
  canvas: HTMLElement,                    // canvas对象
  size: number[],                         // 绘制尺寸，[宽, 高]
  moldPath: string = './mold',            // 模板资源路径
  lang:'cn' | 'jp' | 'en' = 'cn',         // 语言 cn、jp、en
  config: object = defaultConfig,         // 配置信息 - object
  fontLoaded: function = defaultEvent,    // 事件 - function
  imageLoaded: function = defaultEvent,
  fontsLoaded: function = defaultEvent,
  imagesLoaded: function = defaultEvent,
  loaded: function = defaultEvent,
  recover: boolean = false,               // 是否缓存配置与数据 - boolean
  holo: boolean = true,                   // 是否显示防伪标志 - boolean
  cardbagSwitch: boolean = false,         // 是否显示卡包信息 - boolean
  translate: boolean = false,             // 是否自动繁简转换 - boolean
  verbose: boolean = false                // 是否开启啰嗦模式 - boolean
})
```

<br/>

> ### size

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
<br/>

## 🌴 生命周期

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

### loaded

卡片渲染完毕。

<br/>
<br/>
 
## 🧰 config

更改config文件，可以自由地调整卡片的样式，比如字体大小、颜色等。

[具体配置请参考`config/defaultConfig.js`](https://gitee.com/ymssx/cardjs/tree/master/source/config)

```javascript
card.changeConfig(config);
```

<br/>

## 🧮 API

### Card.render

```javascript
await card.render();
```

初始渲染，返回一个promise对象，当绘制完毕时变为fulfilled状态。

<br/>

### Card.feed

你可以自由的使用与更换自定义的中间卡图。

比如当你想把【真红眼黑龙】的卡图换成【青眼白龙】。
```javascript
const pic = document.getElementById('blueEyes');
card.feed(pic);
```

<br/>

### Card.changeConfig

```javascript
card.changeConfig(config);
```


<br/>

### Card.feedData

调整卡片信息。

```javascript
card.feedData(data);
```

或者直接
```javascript
card.data.name = 'Blue Eyes';
```

<br/>

### Card.save

保存卡图到本地，你可以指定保存时**文件名称**和**图片尺寸**。
```javascript
card.save('青眼白龙', [1626, 2370]);
```
也可以不指定参数，card.js会自动使用卡名作为文件名，尺寸会使用默认值1626 × 2370。

<br/>

## 静态方法

以下是Card对象私有的方法，请不要在实例对象上使用。

### Card.complex

将简体字文本转换为繁体字文本。

```javascript
const complexText = Card.complex('青眼白龙'); // 青眼白龍
```

<br/>

### Card.transData

card.js需要你以特定的JSON结构来描述一张卡，觉得麻烦？没关系，使用transData可以**直接兼容YGOPro自带数据库的卡片数据**。

```javascript
const ygoproData = {
  "name": "拥有操纵风在天空飞舞之翼的元素英雄。以来自天空的一击羽翼击破来审判邪恶。",
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
<br/>

## 🧶 实现方式

Card.js

* 📚 cardData.js 

管理卡片数据，监听数据变动，当数据更新之后，cardData会自动分析需要更新哪些文件，然后告知cardFile

* 📁 cardFile.js

管理文件的更新与缓存，当收到cardData的更新请求后，会自动从缓存或者网络调用图片，在文件更新之后会自动告知cardDrawer

* 🎨 cardDrawer.js

管理绘图功能，在收到cardFile的绘图请求后，会按照cardData的数据以及cardFile提供的文件进行绘图
 
