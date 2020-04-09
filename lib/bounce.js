export const bounce = function(thing, time = 1000) {
  let state = false;
  let timer;
  let delay = function () {
    return new Promise((resolve, reject) => {

    })
  }
  return function() {
    return new Promise((resolve, reject) => {
      if (!state) {
        state = true;
        timer = setTimeout(async () => {
          let res = await thing.apply(this, arguments);
          state = false;
          resolve(res);
        }, time);
      } else {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          let res = await thing.apply(this, arguments);
          state = false;
          resolve(res);
        }, time);
      }
    })
  }
};
