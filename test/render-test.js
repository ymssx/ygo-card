const { CardNode } = require('../dist/index.js');
const fs = require('fs');

const DEFAULT_IMAGE_BASE = 'https://gitee.com/ymssx/pics/raw/master/500';
const OUTPUT_PATH = './demo';
const MOLD_PATH = './dist/mold';
const lang = 'cn';
const testData = [
    {
        id: 38033121,
        name: '黑魔术少女',
        desc: '①：这张卡的攻击力上升双方墓地的「黑魔术师」「黑混沌之魔术师」数量×300。',
        atk: 2000,
        def: 1700,
        race: 2,
        type: 33,
        level: 6,
        attribute: 32
      },
      {
        id: 46986414,
        name: '黑魔术师',
        desc: '作为魔法师，攻击力·守备力都是最高级别。',
        atk: 2500,
        def: 2100,
        race: 2,
        type: 17,
        level: 7,
        attribute: 32
      },
      {
        id: 83764718,
        name: '死者苏生',
        desc: '①：以自己或者对方的墓地1只怪兽为对象才能发动。那只怪兽在自己场上特殊召唤。',
        atk: 0,
        def: 0,
        race: 0,
        type: 2,
        level: 0,
        attribute: 0
      },
      {
        id: 44095762,
        name: '神圣防护罩 -反射镜力-',
        desc: '①：对方怪兽的攻击宣言时才能发动。对方场上的攻击表示怪兽全部破坏。',
        atk: 0,
        def: 0,
        race: 0,
        type: 4,
        level: 0,
        attribute: 0
      },
      {
        id: 31111109,
        name: '元素英雄 神·新宇侠',
        desc: '这张卡不用融合召唤不能特殊召唤。名字带有「新宇」·「新空间侠」·「英雄」的怪兽各有1只以上，合计5只的怪兽为融合素材作融合召唤。1回合1次，可以通过把自己墓地存在的1只名字带有「新宇」·「新空间侠」·「英雄」的怪兽从游戏中除外，这张卡的攻击力上升500。并且，直到结束阶段时得到和那只怪兽相同的效果。',
        atk: 2500,
        def: 2500,
        race: 1,
        type: 97,
        level: 12,
        attribute: 16
      },
      {
        id: 35952884,
        name: '流天类星龙',
        desc: '同调怪兽调整＋调整以外的同调怪兽2只以上\r\n' +
          '这张卡不用同调召唤不能特殊召唤。\r\n' +
          '①：这张卡在同1次的战斗阶段中可以作出最多有那些作为同调素材的怪兽之内除调整以外的怪兽数量的攻击。\r\n' +
          '②：1回合1次，魔法·陷阱·怪兽的效果发动时才能发动。那个发动无效并破坏。\r\n' +
          '③：表侧表示的这张卡从场上离开时才能发动。从额外卡组把1只「流星龙」特殊召唤。',
        atk: 4000,
        def: 4000,
        race: 8192,
        type: 8225,
        level: 12,
        attribute: 16
      },
      {
        id: 52653092,
        name: '闪光No.0 希望之异热同心',
        desc: '相同阶级的「No.」超量怪兽×3\r\n' +
          '规则上，这张卡的阶级当作1阶使用。这张卡也能把手卡1张「升阶魔法」通常魔法卡丢弃，在自己场上的「希望皇 霍普」怪兽上面重叠来超量召唤。\r\n' +
          '①：这张卡的超量召唤不会被无效化。\r\n' +
          '②：在这张卡的超量召唤成功时，对方不能把效果发动。\r\n' +
          '③：这张卡的攻击力·守备力上升这张卡的超量素材数量×1000。\r\n' +
          '④：对方回合1次，把这张卡1个超量素材取除才能发动。这个回合对方不能把效果发动。',
        atk: -2,
        def: -2,
        race: 1,
        type: 8388641,
        level: 1,
        attribute: 16
      },
      {
        id: 16178681,
        name: '异色眼灵摆龙',
        desc: '←4 【灵摆】 4→\r\n' +
          '这个卡名的①②的灵摆效果1回合各能使用1次。\r\n' +
          '①：可以把自己的灵摆怪兽的战斗发生的对自己的战斗伤害变成0。\r\n' +
          '②：自己结束阶段才能发动。这张卡破坏，从卡组把1只攻击力1500以下的灵摆怪兽加入手卡。\r\n' +
          '【怪兽效果】\r\n' +
          '①：这张卡用和对方怪兽的战斗给与对方的战斗伤害变成2倍。',
        atk: 2500,
        def: 2000,
        race: 8192,
        type: 16777249,
        level: 67371015,
        attribute: 32
      },
      {
        id: 13331639,
        name: '霸王龙 扎克',
        desc: '←1 【灵摆】 1→\r\n' +
          '①：只要这张卡在灵摆区域存在，对方场上的融合·同调·超量怪兽不能把效果发动。\r\n' +
          '②：1回合1次，对方在抽卡阶段以外从卡组把卡加入手卡时才能发动。那卡破坏。\r\n' +
          '【怪兽效果】\r\n' +
          '龙族的融合·同调·超量·灵摆怪兽各1只合计4只\r\n' +
          '这张卡不用融合召唤不能特殊召唤。\r\n' +
          '①：这张卡特殊召唤成功的场合发动。对方场上的卡全部破坏。\r\n' +
          '②：这张卡不会成为对方的效果的对象，不会被对方的效果破坏。\r\n' +
          '③：这张卡战斗破坏对方怪兽时才能发动。从卡组·额外卡组把1只「霸王眷龙」怪兽特殊召唤。\r\n' +
          '④：怪兽区域的这张卡被战斗·效果破坏的场合才能发动。这张卡在自己的灵摆区域放置。',
        atk: 4000,
        def: 4000,
        race: 8192,
        type: 16777313,
        level: 16842764,
        attribute: 32
      },
      {
        id: 1861629,
        name: '解码语者',
        desc: '效果怪兽2只以上\r\n' +
          '①：这张卡的攻击力上升这张卡所连接区的怪兽数量×500。\r\n' +
          '②：自己场上的卡为对象的魔法·陷阱·怪兽的效果由对方发动时，把这张卡所连接区1只自己怪兽解放才能发动。那个发动无效并破坏。',
        atk: 2300,
        def: 133,
        race: 16777216,
        type: 67108897,
        level: 3,
        attribute: 32
      },
      {
        id: 20654247,
        name: '青眼混沌龙',
        desc: '「混沌形态」降临。这张卡不用仪式召唤不能特殊召唤。\r\n' +
          '①：这张卡不会成为对方的效果的对象，不会被对方的效果破坏。\r\n' +
          '②：使用「青眼白龙」作仪式召唤的这张卡的攻击宣言时才能发动。对方场上的全部怪兽的表示形式变更。这个效果让表示形式变更的怪兽的攻击力·守备力变成0。这个回合，这张卡向守备表示怪兽攻击的场合，给与攻击力超过那个守备力的数值的战斗伤害。',
        atk: 3000,
        def: 0,
        race: 8192,
        type: 161,
        level: 8,
        attribute: 32
      }
]

async function renderCanvasToImageFile(canvas, file) {
    console.log(`creating ${file}`);
    return new Promise((resolve ,reject) => {
        const out = fs.createWriteStream(file);
        const stream = canvas.createJPEGStream();
        stream.pipe(out);
        out.on('finish', () => {console.log(`${file} was created`);resolve();});
        out.on('error', () => {console.log(`fail to create ${file}`, error);reject(error);});
    });
}

async function renderTest() {
    testData
        .map(data => new CardNode({
            data: CardNode.transData(data),
            lang: lang,
            moldPath: `${MOLD_PATH}/`, 
            picPath: `${DEFAULT_IMAGE_BASE}/${data.id}.jpg`
        }))
        .map(async card => {
            const canvas = await card.render();
            renderCanvasToImageFile(canvas, `${OUTPUT_PATH}/${card.data.name}.jpg`);
        })
}

renderTest();