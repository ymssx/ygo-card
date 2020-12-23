export const readYDK = (text) => {
  let temp = text.split("#main")[1].split("#extra");
  let mainText = temp[0].trim();
  let temp2 = temp[1].split("!side");
  let exText = temp2[0].trim();
  let sideText = temp2[1].trim();

  let main = mainText.split("\n");
  let ex = exText.split("\n");
  let side = sideText.split("\n");
  return [main, ex, side];
};

export const getIdSetFromYDK = (text) => {
  const [main, ex, side] = readYDK(text);
  return Array.from(new Set(main.concat(ex).concat(side)));
};
