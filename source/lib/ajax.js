export const Cloud = function ({ method = 'GET', path, data }) {
  return new Promise(((resolve, reject) => {
    let ajax = new XMLHttpRequest();

    if ((method === 'GET' || method === 'get') && data) {
      let tempData = [];
      for (let key in data) {
        tempData.push(key + '=' + data[key]);
      }
      let resData = path + '?' + tempData.join('&');

      ajax.open(method, resData, true);
      ajax.send()
    } else {
      ajax.open(method, path, true);
      ajax.send(data);
    }

    ajax.onreadystatechange = function() {
      if (ajax.readyState === 4) {
        if ((ajax.status >= 200 && ajax.status < 300) || ajax.status === 304) {
          resolve(ajax.responseText);
        } else {
          reject (new Error('ajax send failed'));
        }
      }
    }
  }))
};
