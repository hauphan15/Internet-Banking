const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from useraccounts')
};