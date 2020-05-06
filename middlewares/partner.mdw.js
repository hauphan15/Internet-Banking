const createError = require('http-errors');
const config = require('../config/default.json');

module.exports = function(req, res, next) {

    const partnerCode = req.headers['x-partner-code'];

    if (partnerCode === config.partner.partnerCode) {
        next();

    } else {
        res.send('Invalid partnerCode or partnerCode not found');
        throw createError(401, 'Invalid partnerCode.');
    }
}