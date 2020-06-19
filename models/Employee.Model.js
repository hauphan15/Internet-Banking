const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {
    all: _ => db.load('SELECT * FROM employees'),

    singleById: id => db.load(`SELECT * FROM employees WHERE ID = ${id}`),

    singleByUserName: username => db.load(`SELECT * FROM employees WHERE UserName = '${username}'  `),

    updateInfo: (id, entity) => db.update('employees', 'ID', id, entity),

    delete: id => db.del('employees', { ID: id }),

    add: entity => {
        // entity = {
        //     "UserName": "",
        //     "UserPassword": "",
        //     "FullName": "",
        //     "Email": "",
        //     "Phone": "",
        //     "DoB": "",
        // }

        const hash = bcrypt.hashSync(entity.UserPassword, 8);
        entity.UserPassword = hash;
        return db.add('employees', entity);
    },

    login: async entity => {
        // entity = {
        //   "UserName": "",
        //   "UserPassword": ""
        // }
        const rows = await db.load(`SELECT * FROM employees WHERE UserName = '${entity.UserName}' `);
        if (rows.length === 0)
            return null;

        const hashPwd = rows[0].UserPassword;
        if (bcrypt.compareSync(entity.UserPassword, hashPwd)) {
            return rows[0];
        }

        return null;
    },

    updateRefreshToken: async(employeeId, token) => {

        await db.del('employeerefreshtokenext', { ID: employeeId });

        const entity = {
            ID: employeeId,
            RefreshToken: token,
            Rdt: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        return db.add('employeerefreshtokenext', entity);
    },

    verifyRefreshToken: async(employeeId, token) => {
        const sql = `SELECT * FROM employeerefreshtokenext WHERE ID = ${employeeId} and RefreshToken = '${token}'`;
        const rows = await db.load(sql);
        if (rows.length > 0)
            return true;

        return false;
    }
};