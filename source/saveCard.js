const { getCard } = require('./getCard');
const fs = require('fs');

const saveCard = (data, {
  picPath,
  moldPath = './mold',
  type = 'image/png',
  size = [813, 1185],
  savePath,
}) => {
  return new Promise(async (resolve, reject) => {
    const pic = await getCard(data, { picPath, moldPath, type, size });
    
    fs.writeFile(savePath, pic, { flag: 'w' } , function (err) {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  })
}

module.exports.saveCard = saveCard;
