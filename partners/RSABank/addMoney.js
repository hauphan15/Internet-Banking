const md5 = require("md5");
const NodeRSA = require("node-rsa");
const axios = require('axios');

//private key cua HHBANK
const rsaPrivateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQCfNquA8GzsoFPyzYUzSRCs+k1S3zXiYpVKqjr2/2FgYLOZKNj4
tQ7d5FMNdUjou+nBtFjI7b2c91DSQICS4HdIUKOjXNdOPgBZxvob7NlyIHoGNhgY
bbh2AbzkMlH13d4Y3yyxQgu4hpUh9dOOTjTVNgJFHWAhk4bu2uENtf+mEwIDAQAB
AoGAJ8ulcJQn1bl5Yj4mphwENAhYXXd3Y3+aq1ADbwuETm+9VHIWUYwIDERu0fVX
5PxbQFSQwKBT/bD/nZ4LxSqgBai2Z+lhRAHjGCEpuasHv4tjTAHdpuRLcTGhff7z
oq7Q8TDK5J3rfnOENZut5+XFc0/rpjnto42neskLnyyYNmECQQDiLw0sVVtffl77
+SOgofKykxdY0Wc3+qX5ZWKDeedcbk4iIcpOA/osDwUwoDrr2tYvfqWCH62BgxEg
xJykSKdDAkEAtDOYpXq4+y7q1ToHpeoJf9RoalKqvabZAHhkt7XyXk+lNFgo798a
9tLL3dps6Nboi/oIkdyNdghsLrBHHuIQ8QJBAJXgfccpzIFruL8ZKQ2RIsRICcl2
AQKsGX04PF5I0hGCmk2tvGOT6Rt23IaLNmABQ7p3Hm8qVIukcR4Yin+mEQcCQQCY
4Dj9EmtCdaA2Ox/n6vAaKWpX4UAG2zi4BGt1y38N8cW27Z/1ODKY+WaJFVhWBJSO
xBVnIVRFsYmN5nC/y4wRAkA+wNkCXhAqh7ewOj4D0XLTEW8e3eldVvILkIBfOFrl
m2Q8vO1+v1UdPu6aAkN1A0S2A049t5JrGkVpP0gvmu4k
-----END RSA PRIVATE KEY-----`;
const Private_Key = new NodeRSA(rsaPrivateKey);

//publickey SACOMBANK
const rsaPubkey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFzcv1eeq8IF3xXlhPHZSEWcQib/
oLGhx5KhwDjJr6A9d0HwJMkyso6m1O8w7vEtTbWSG9Yq5WYQHW9vfc6XgDwT+8gr
xQIOFQs85imInMDyvnqNEJKqSVdPL9057pbaZILxXU1/yUUJmqme+y+5Rc9MDx7P
VDuD8Sm0MqcDhrUJAgMBAAE=
-----END PUBLIC KEY-----`;
const key = new NodeRSA(rsaPubkey);

const ts = Date.now();
console.log('x-timestamp:', ts); //timestamp

//request gui nap tien
const content_transfer = {
    number: "206244699",
    amount: "500000"
};

//encrypt goi tin content_transfer
const message_transfer = key.encrypt(content_transfer, 'base64');

//ky vao goi tin content_transfer da encrypt
const signature_hhbank = Private_Key.sign(content_transfer, 'base64');

//body la content_transfer_hhbank chua message: da ma hoa, signature: chu ky vua ky vao message_transfer
const content_transfer_hhbank = {
    message: message_transfer,
    signature: signature_hhbank
};

//partner-sig
const sign_transfer_hhbank = md5(ts.toString() + JSON.stringify(content_transfer_hhbank) + 'sacombank-linking-code');
console.log('x-partner-sign:', sign_transfer_hhbank);
console.log('body', JSON.stringify(content_transfer_hhbank));


async function makePostRequest() {
    axios.post('https://sacombank-internet-banking.herokuapp.com/services/accounts/transfer', {
            message: content_transfer_hhbank.message,
            signature: content_transfer_hhbank.signature
        }, {
            headers: {
                'x-partner-code': 'hhbank',
                'x-partner-sign': sign_transfer_hhbank,
                'x-timestamp': ts
            }
        })
        .then(async function(response) {
            console.log(response.data);
            dt = response.data;

            const decryptedMessage = Private_Key.decrypt(dt.messageResponse, 'utf8');
            console.log(JSON.parse(decryptedMessage));

            const isValid = key.verify(JSON.parse(decryptedMessage), dt.signatureResponse, 'utf8', 'base64');
            console.log(`isValid: ${isValid}`);
        })
        .catch(function(error) {
            console.log(error);
        });
}
makePostRequest();