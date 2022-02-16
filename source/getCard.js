const { Card } = require('./cardNode.js');

const getCard = async (data, {
  picPath,
  moldPath = './mold',
  type = 'image/png',
  size = 813,
}) => {
  const card = new Card({
    data,
    size,
    picPath,
    moldPath,
  });

  const canvas = await card.render();
  return canvas.toBuffer(type);
};

module.exports.getCard = getCard;
