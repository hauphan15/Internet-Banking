const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {
    all: _ => db.load('SELECT * FROM useraccounts'),

    add: entity => {
        // entity = {
        //     "UserName": "",
        //     "UserPassword": "",
        //     "FullName": "",
        //     "UserEmail": "",
        //     "UserPhone": "",
        // }
        const hash = bcrypt.hashSync(entity.UserPassword, 8);
        entity.UserPassword = hash;
        return db.add('useraccounts', entity);
    },

    singleById: id => db.load(`SELECT * FROM useraccounts WHERE UserID = ${id}`),

    singleByNumber: number => db.load(`SELECT * FROM useraccounts WHERE Number = '${number}' `),

    singleByUserName: username => db.load(`SELECT * FROM useraccounts WHERE UserName = '${username}' `),

    login: async entity => {
        // entity = {
        //   "UserName": "",
        //   "UserPassword": ""
        // }
        const rows = await db.load(`SELECT * FROM useraccounts WHERE UserName = '${entity.UserName}' `);
        if (rows.length === 0)
            return null;

        const hashPwd = rows[0].UserPassword;
        if (bcrypt.compareSync(entity.UserPassword, hashPwd)) {
            return rows[0];
        }

        return null;
    },

    updateRefreshToken: async(userId, token) => {

        await db.del('userrefreshtokenext', { UserID: userId });

        const entity = {
            UserID: userId,
            RefreshToken: token,
            Rdt: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        return db.add('userrefreshtokenext', entity);
    },

    verifyRefreshToken: async(userId, token) => {
        const sql = `SELECT * FROM userrefreshtokenext WHERE ID = ${userId} and RefreshToken = '${token}'`;
        const rows = await db.load(sql);
        if (rows.length > 0)
            return true;

        return false;
    }
};