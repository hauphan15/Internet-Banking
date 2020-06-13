const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {
    all: _ => db.load('SELECT * FROM adminaccount'),

    singleById: id => db.load(`SELECT * FROM adminaccount WHERE ID = ${id}`),

    singleByUserName: username => db.load(`SELECT * FROM adminaccount WHERE UserName = '${username}'  `),

    updateInfo: (id, entity) => db.update('adminaccount', 'ID', id, entity),

    delete: id => db.del('adminaccount', { ID: id }),

    add: entity => {
        // entity = {
        //     "UserName": "",
        //     "Password": "",
        //     "FullName": "",
        //     "Email": "",
        //     "Phone": "",
        //     "DoB": "",
        // }

        const hash = bcrypt.hashSync(entity.Password, 8);
        entity.Password = hash;
        return db.add('adminaccount', entity);
    },

    login: async entity => {
        // entity = {
        //   "UserName": "",
        //   "UserPassword": ""
        // }
        const rows = await db.load(`SELECT * FROM adminaccount WHERE UserName = '${entity.UserName}' `);
        if (rows.length === 0)
            return null;

        const hashPwd = rows[0].UserPassword;
        if (bcrypt.compareSync(entity.UserPassword, hashPwd)) {
            return rows[0];
        }

        return null;
    },

    updateRefreshToken: async(adminId, token) => {

        await db.del('adminfreshtokenext', { ID: adminId });

        const entity = {
            ID: adminId,
            RefreshToken: token,
            Rdt: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        return db.add('adminrefreshtokenext', entity);
    },

    verifyRefreshToken: async(adminId, token) => {
        const sql = `SELECT * FROM adminrefreshtokenext WHERE ID = ${adminId} and RefreshToken = '${token}'`;
        const rows = await db.load(sql);
        if (rows.length > 0)
            return true;

        return false;
    }
};