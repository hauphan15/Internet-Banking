const mysql = require('mysql');
const { promisify } = require('util');
// const promisify = require('util').promisify;

const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql);
const pool_query = promisify(pool.query).bind(pool);

module.exports = {
    load: sql => pool_query(sql)
};