const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM hhbank')
};