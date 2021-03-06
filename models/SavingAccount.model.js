const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM SavingAccounts'),

    singleByUserId: userid => db.load(`SELECT * FROM SavingAccounts WHERE UserID = ${userid}`),

    singleByNumber: number => db.load(`SELECT * FROM SavingAccounts WHERE Number = '${number}'  `),

    updateMoney: (id, entity) => db.update('SavingAccounts', 'ID', id, entity),

    add: entity => {
        // entity = {
        //     "UserID": "",
        //     "Balance": "",
        //     "Number": ""
        // }
        return db.add('SavingAccounts', entity);
    },

    removeAccount: CustomerId => db.load(`DELETE FROM SavingAccounts WHERE UserID = ${CustomerId}`)
};