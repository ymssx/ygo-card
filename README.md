# card.js

这是一个游戏王卡片渲染工具，你只需要在你的网站引入card.js，就可以轻松地渲染出标准的游戏王卡图！

## 为什么使用card.js

card.js会追踪数据的变动，自动地更新卡图，这在与表单交互场景十分有用。同时，对于大量的图片更新请求，card.js只会进行一次绘制，因此您不用过多的担心性能问题。

card.js十分容易使用，您只需要短短的一行代码，就能将一张canvas画布变成一张游戏王高清卡图！另外，card.js可以自由的更改模板样式，在config文件中您可以随心所欲地进行创作！

## 演示
[在线演示](https://ymssx.gitee.io/ygo)

<div align=left>
    <img src="https://gitee.com/ymssx/yugioh-card/raw/master/demo/demoCn.jpg" height="200" />
    <img src="https://gitee.com/ymssx/yugioh-card/raw/master/demo/demoJp.jpg" height="200" />
    <img src="https://gitee.com/ymssx/yugioh-card/raw/master/demo/demoEn.jpg" height="200" />
</div>

## 使用方式
### ES Module

```javascript
import Card from './card.js'

let card = new Card({ cardData, canvas, size })
```

#### cardData -- 卡片信息，包括名字、密码、效果等
```typescript
interface cardData = {
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
  
例如 

```javascript
let cardData = { 
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
```
  
#### canvas -- canvas对象

 ## 生命周期
 通过传入事件来自定义卡片渲染的生命周期钩子函数

 > fontLoaded
 >> 单个字体文件加载完成
 
 > fontsLoaded
 >> 所有字体文件加载完成

 > imageLoaded
 >> 单个图片资源加载完成

 > imagesLoaded
 >> 单个图片资源加载完成

 > loaded
 >> 卡片渲染完毕
 
 ## 扩展
 
```typescript
const Card = function ({
  cardData: object,                       // 卡片数据
  canvas: HTMLElement,                    // canvas对象
  size: number[] = [813, 1185],           // 绘制尺寸，[宽, 高]
  lang:'cn' | 'jp' | 'en' = 'cn',         // 语言 cn、jp、en
  config: object = defaultConfig,         // 配置信息 - object
  fastFont: boolean = true,               // 精简字体 - boolean
  fontLoaded: function = defaultEvent,    // 事件 - function
  imageLoaded: function = defaultEvent,
  fontsLoaded: function = defaultEvent,
  imagesLoaded: function = defaultEvent,
  loaded: function = defaultEvent,
  recover: boolean = false,               // 是否缓存配置与数据 - boolean
  holo: boolean = true,                   // 是否显示防伪标志 - boolean
  cardbagSwitch: boolean = false,         // 是否显示卡包信息 - boolean
  translate: boolean = false              // 是否自动繁简转换 - boolean
})
```
 
## config
更改config文件，可以自由地调整卡片的样式，[具体配置请参考`config/defaultConfig.js`](https://gitee.com/ymssx/cardjs/tree/master/config)

`card.changeConfig(config)`

## API
#### Card.changeConfig

`card.changeConfig(config)`

#### Card.feedData

调整卡片信息

`card.feedData(cardData)`

或者直接
`card.cardData.name = 'Blue Eyes'`

#### Card.save

保存卡图

## 实现方式

Card.js

### cardData.js 
>管理卡片数据，监听数据变动，当数据更新之后，cardData会自动分析需要更新哪些文件，然后告知fileManage

### fileManage.js
> 管理文件的更新与缓存，当收到cardData的更新请求后，会自动从缓存或者网络调用图片，在文件更新之后会自动告知cardDrawer

### cardDrawer.js
> 管理绘图功能，在收到fileManage的绘图请求后，会按照cardData的数据以及fileManage提供的文件进行绘图
 
