const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('C:/Users/Yami/Desktop/ygoServer/cards.cdb');

const getData = function(id) {
  return new Promise((resolve, reject) => {
    let res = {};

    db.get("SELECT name, desc from texts where id='" + id + "'", function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        res = Object.assign(res, row);
      }      
    });

    db.get("SELECT id, atk, def, race, type, level, attribute from datas where id='" + id + "'", function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        res = Object.assign(res, row);
        resolve(res);
      }      
    });
  })
}


const getMultiData = function(ids) {
  if (typeof ids === 'string') ids = JSON.parse(ids);

  return ids.map(id => {
    return getData(id);
  })
}

module.exports = {
  getData,
  getMultiData
};
