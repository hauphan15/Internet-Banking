const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM partners'),
    single: code => db.load(`SELECT * FROM partners WHERE PartnerCode = '${code}' `)
};