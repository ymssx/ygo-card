const sqlite3 = require('sqlite3');

const dbMap = {};

const getData = function(dbPath, id) {
  if (!dbMap[dbPath]) {
    dbMap[dbPath] = new sqlite3.Database(dbPath);
  }

  const db = dbMap[dbPath];

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
};


const getMultiData = function(dbPath, ids) {
  if (typeof ids === 'string') ids = JSON.parse(ids);

  return ids.map(id => {
    return getData(dbPath, id);
  })
};

module.exports = {
  getData,
  getMultiData
};
