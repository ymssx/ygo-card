const sqlite3 = require('sqlite3');

const dbMap = {};

const getData = function(dbPath, id) {
  if (!dbMap[dbPath]) {
    dbMap[dbPath] = new sqlite3.Database(dbPath);
  }

  const db = dbMap[dbPath];

  return new Promise((resolve, reject) => {
    db.get("SELECT t.id, t.name, t.desc, d.atk, d.def, d.race, d.type, d.level, d.attribute from texts t, datas d where t.id = d.id and t.id='" + id + "'", function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(row);
      }      
    });
  })
};


const getMultiData = function(dbPath, ids) {
  if (typeof ids === 'string') ids = JSON.parse(ids);

  return Promise.all(ids.map(id => {
    return getData(dbPath, id);
  }));
};

module.exports = {
  getData,
  getMultiData
};
