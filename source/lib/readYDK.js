export const readYDK = (text) => {
  const newText = text.split('\r').join('');
  const [_, afterMain = ''] = newText.split('#main');
  const [mainText, afterExtra = ''] = afterMain.split('#extra');
  const [extraText, sideText = ''] = afterExtra.split('!side');

  const main = mainText ? mainText.trim().split('\n') : [];
  const extra = extraText ? extraText.trim().split('\n'): [];
  const side = sideText ? sideText.trim().split('\n') : [];
  return [main, extra, side];
};

export const getIdSetFromYDK = (text) => {
  const [main, extra, side] = readYDK(text);
  return Array.from(new Set(main.concat(extra).concat(side)));
};
