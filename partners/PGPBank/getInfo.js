const moment = require('moment');
const axios = require('axios');
const crypto = require('crypto');

const body = {
    accountNumber: 12345678901,
};

const username = 'nhom16';
const password = 'nhom16';

const hash = crypto.createHmac('md5', 'webnangcao_hash').update(JSON.stringify(body)).digest('hex');

function makePostRequest() {
    axios.post('https://beohoang98-bank-dev.herokuapp.com/api/partner/check-account', body, {
            auth: {
                username,
                password
            },
            headers: {
                'x-partner-hash': hash,
                'x-partner-time': moment().unix().toString(),
            }
        })
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}
makePostRequest();