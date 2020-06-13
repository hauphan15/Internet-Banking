const db = require('../utils/db');

module.exports = {
    all: _ => db.load('SELECT * FROM employees'),

    singleById: id => db.load(`SELECT * FROM employees WHERE ID = ${id}`),

    singleByUserName: username => db.load(`SELECT * FROM employees WHERE UserName = '${username}'  `),

    updateInfo: (id, entity) => db.update('employees', 'ID', id, entity),

    delete: id => db.del('employees', { ID: id }),

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
        return db.add('employees', entity);
    },
};