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

    allTakeTrans: number => db.load(
        `SELECT * 
        FROM transactions
        WHERE Number_NN = '${number}' AND Type = 'CHUYENKHOAN' 
        ORDER BY Time DESC`),

    allSendTrans: number => db.load(
        `SELECT * 
        FROM transactions
        WHERE Number_NG = '${number}' AND Type = 'CHUYENKHOAN' 
        ORDER BY Time DESC`),

    allDebTrans: number => db.load(
        `SELECT * 
        FROM (SELECT * FROM transactions WHERE Type='NHACNO') AS NhacNo
        WHERE NhacNo.Number_NN =${number} OR NhacNo.Number_NG=${number}
        ORDER BY NhacNo.Time DESC`),
};