const createError = require('http-errors');
const config = require('../config/default.json');
const moment = require('moment');
const CryptoJS = require('crypto-js');

module.exports = {

    partnerCode: (req, res, next) => {
        const partnerCode = req.headers['x-partner-code'];
        //so sanh partnerCode
        if (partnerCode === config.partner.partnerCode) {
            next();

        } else {
            res.send('Invalid partnerCode or partnerCode not found');
            throw createError(401, 'Invalid partnerCode or partnerCode not found');
        }
    },
    partnerTime: (req, res, next) => {

        const partnerTime = req.headers['x-partner-time'];
        const now = moment().unix();
        //kiem tra goi tin da qua han hay chua, chi chap nhan goi tin da gui duoi 60s
        if ((now - partnerTime) <= 60) {
            next();
        } else {

            res.send('Invalid time');
            throw createError(401, 'Invalid time');
        }
    },
    partnerSig: (req, res, next) => {

        const partnerSig = req.headers['x-partner-sig'];
        const partnerTime = req.headers['x-partner-time'];
        const partnerBody = req.body.message;
        console.log(`partnerBody: ${partnerBody}`);
        //cong partnertime va bodyjson
        const data = partnerTime + partnerBody;
        //roi hash bang MD%
        const ciphertext = CryptoJS.MD5(data, config.partner.SecretKey).toString();
        console.log(`ciphertext: ${ciphertext}`);
        if (partnerSig === ciphertext) {
            next();
        } else {

            res.send('Invalid signature');
            throw createError(401, 'Invalid signature');
        }

    }
}