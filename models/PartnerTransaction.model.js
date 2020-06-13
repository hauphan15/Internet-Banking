const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM partnertransactions'),

    singleById: id => db.load(`SELECT * FROM partnertransactions WHERE ID = ${id} `),

    singleByNumber: number => db.load(`SELECT * FROM partnertransactions WHERE Number = '${number}'  `),

    add: entity => {
        // entity = {
        //     "SendBank": "",
        //     "TakeBank": "",
        //     "Money": "",
        //     "Time": "",
        // }
        return db.add('partnertransactions', entity);
    },

    delete: id => db.del('partnertransactions', { ID: id }),

    update: (id, entity) => db.update('partnertransactions', 'ID', id, entity),

    byDate: entity => db.load(
        `SELECT *
        FROM partnertransactions
        WHERE (Time BETWEEN '${entity.from}' AND '${entity.to}') `),

    byPartnerBank: partner => db.load(
        `SELECT * 
        FROM partnertransactions 
        WHERE SendBank = '${partner}' OR TakeBank = '${partner}' `)
}