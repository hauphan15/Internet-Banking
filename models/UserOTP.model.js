const db = require('../utils/db');
const moment = require('moment');

module.exports = {
    all: _ => db.load('SELECT * FROM userotp'),

    updateOTP: async entity => {
        // entity = {
        //     "UserID": "",
        //     "Code": "",
        //     "Time": ""
        // }
        await db.del('userotp', { UserID: entity.UserID });
        return db.add('userotp', entity);
    },

    singleByUserId: id => db.load(`SELECT * FROM userotp WHERE UserID = ${id}`),
};