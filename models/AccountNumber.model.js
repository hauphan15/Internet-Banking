const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM AccountNumbers'),
    single: id => db.load(`SELECT * FROM AccountNumbers WHERE UserID = ${id}`),
    updateMoney: (id, entity) => db.update('AccountNumbers', 'UserID', id, entity)
};