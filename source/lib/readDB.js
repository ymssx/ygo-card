const sqlite3 = require('sqlite3');

const dbMap = {};

const queryData = function(dbPath, sql) {
  if (!dbMap[dbPath]) {
    dbMap[dbPath] = new sqlite3.Database(dbPath);
  }

  const db = dbMap[dbPath];

  return new Promise((resolve, reject) => {
    db.get(sql, function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(row);
      }      
    });
  });
}

const queryDataList = function(dbPath, sql) {
  if (!dbMap[dbPath]) {
    dbMap[dbPath] = new sqlite3.Database(dbPath);
  }

  const db = dbMap[dbPath];

  return new Promise((resolve, reject) => {
    db.all(sql, function (err, row) {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(row);
      }      
    });
  });
}

const getData = function(dbPath, id) {
  return queryData(
    dbPath,
    `SELECT t.id, t.name, t.desc, d.atk, d.def, d.race, d.type, d.level, d.attribute FROM texts t, datas d WHERE t.id = d.id AND t.id = '${id}'`,
  );
};


const getMultiData = function(dbPath, ids) {
  if (typeof ids === 'string') ids = JSON.parse(ids);

  return Promise.all(ids.map(id => {
    return getData(dbPath, id);
  }));
};

module.exports = {
  queryData,
  getData,
  queryDataList,
  getMultiData
};
