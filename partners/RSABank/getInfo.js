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

const bankName = 'hhbank or agribank';
const ts = Date.now();
console.log('x-timestamp:', ts); ///////////////////////////////timestamp

console.log("INFO: ");
console.log('x-partner-code:', bankName);
let content_info = {
    number: "206244699"
};

const key = new NodeRSA(rsaPubkey);

///////////////////////////////// encrypt body
const message_info = key.encrypt(
    content_info,
    'base64'
);

content_info = {
    message: message_info
};
const sign_info = md5(ts.toString() + JSON.stringify(content_info) + 'sacombank-linking-code'); ///hash md5 de lay partner-sig

async function makePostRequest() {
    axios.post('https://sacombank-internet-banking.herokuapp.com/services/accounts/info', {
            message: content_info.message
        }, {
            headers: {
                'x-partner-code': 'hhbank',
                'x-partner-sign': sign_info,
                'x-timestamp': ts
            }
        })
        .then(async function(response) {
            console.log(response.data);
            dt = response.data;
            const decryptedMessage = Private_Key.decrypt(dt.messageResponse, 'utf8')
            console.log(JSON.parse(decryptedMessage));

        })
        .catch(function(error) {
            console.log(error);
        });
}
makePostRequest();