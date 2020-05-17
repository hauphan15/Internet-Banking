const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM useraccounts'),
    single: id => db.load(`SELECT * FROM useraccounts WHERE UserID = ${id}`)
};