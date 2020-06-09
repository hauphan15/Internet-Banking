const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM SavingAccounts'),

    singleById: id => db.load(`SELECT * FROM SavingAccounts WHERE UserID = ${id}`),

    singleByNumber: number => db.load(`SELECT * FROM SavingAccounts WHERE Number = '${number}'  `),

    updateMoney: (id, entity) => db.update('SavingAccounts', 'UserID', id, entity),

    add: entity => {
        // entity = {
        //     "UserID": "",
        //     "Balance": "",
        //     "Number": ""
        // }
        return db.add('SavingAccounts', entity);
    },
};