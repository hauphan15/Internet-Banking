const mysql = require('mysql');
const { promisify } = require('util');
const config = require('../config/default.json');

const pool = mysql.createPool(config.herokuMySQL);
const pool_query = promisify(pool.query).bind(pool);

module.exports = {
    load: sql => pool_query(sql),

    add: (tableName, entity) => pool_query(`INSERT INTO ${tableName} SET ?`, entity),

    del: (tableName, condition) => pool_query(`DELETE FROM ${tableName} WHERE ?`, condition),

    update: (tableName, idField, id, entity) => pool_query(`UPDATE ${tableName} SET ? WHERE ${idField} = ${id}`, entity)
};