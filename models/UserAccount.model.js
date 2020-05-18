const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM useraccounts'),
    singleById: id => db.load(`SELECT * FROM useraccounts WHERE UserID = ${id}`),
    singleByNumber: number => db.load(`SELECT * FROM useraccounts WHERE Number = ${number}`)
};