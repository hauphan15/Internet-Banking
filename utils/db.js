const mysql = require('mysql');
const { promisify } = require('util');


const config = require('../config/default.json');


const pool = mysql.createPool(config.herokuMySQL);
const pool_query = promisify(pool.query).bind(pool);

module.exports = {
    load: sql => pool_query(sql),
    add: (tableName, entity) => pool_query(`insert into ${tableName} set ?`, entity),
    del: (tableName, condition) => pool_query(`delete from ${tableName} where ?`, condition),
    update: (tableName, idField, id, entity) => pool_query(`update ${tableName} set ? where ${idField} = ${id}`, entity)
};