const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM transactions'),

    singleById: id => db.load(`SELECT * FROM transactions WHERE UserID = ${id}`),

    singleByNumber: number => db.load(`SELECT * FROM transactions WHERE Number = '${number}'  `),

    add: entity => {
        // entity = {
        //     "Money": "",
        //     "Type": "",
        //     "Time": "",
        //     "Number_NN": "",
        //     "Number_NG": "",
        //     "Content": "",
        //     "Fee": "",
        // }
        return db.add('transactions', entity);
    },
};