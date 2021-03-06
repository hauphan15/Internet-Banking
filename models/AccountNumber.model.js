const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM AccountNumbers'),

    singleById: id => db.load(`SELECT * FROM AccountNumbers WHERE UserID = ${id}`),

    singleByNumber: number => db.load(`SELECT * FROM AccountNumbers WHERE Number = '${number}'  `),

    updateMoney: (id, entity) => db.update('AccountNumbers', 'UserID', id, entity),

    add: entity => {
        // entity = {
        //     "UserID": "",
        //     "AccountBalance": "",
        //     "Number": ""
        // }
        return db.add('AccountNumbers', entity);
    },

    removeAccount: CustomerId => db.load(`DELETE FROM AccountNumbers WHERE UserID = ${CustomerId}`)
};