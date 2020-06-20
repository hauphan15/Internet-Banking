const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM takerlist'),

    singleById: id => db.load(`SELECT * FROM takerlist WHERE ID = ${id} `),

    singleByUserId: id => db.load(`SELECT * FROM takerlist WHERE UserID = ${id} `),

    singleByNumber: number => db.load(`SELECT * FROM takerlist WHERE Number = '${number}'  `),

    add: entity => {
        // entity = {
        //     "Number": "",
        //     "Name": "",
        // }
        return db.add('takerlist', entity);
    },

    delete: id => db.del('takerlist', { ID: id }),

    update: (id, entity) => db.update('takerlist', 'ID', id, entity)

};