const express = require('express');
const PartnerTransModel = require('../../models/PartnerTransaction.model');
const TransModel = require('../../models/Transaction.model');
const md5 = require("md5");
const NodeRSA = require("node-rsa");
const axios = require('axios');
const moment = require('moment');
const AccNumModel = require('../../models/AccountNumber.model');
const UserAccModel = require('../../models/UserAccount.model');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const TakerListModel = require('../../models/TakerList.model');
const UserOTPModel = require('../../models/UserOTP.model');

const router = express.Router();

router.post('/get-info', async(req, res) => {
    // req.bodu = {
    //     "UserID": "",
    //      "Name": "",
    //     "Number": ""
    // }

    let info;

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

    const ts = Date.now();
    let content_info = {
        number: req.body.Number
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
                dt = response.data;
                const decryptedMessage = Private_Key.decrypt(dt.messageResponse, 'utf8')
                const result = JSON.parse(decryptedMessage);
                console.log(JSON.parse(decryptedMessage));
                if (result.success === true) {

                    let name = req.body.Name;
                    if (name === '') { //nếu k nhập tên gợi nhớ thì lấy tên đăng ký
                        name = result.data.name;
                    }

                    const taker = {
                        UserID: req.body.UserID,
                        Number: req.body.Number,
                        Name: name
                    };

                    const retAdd = await TakerListModel.add(taker);
                    const takerName = await TakerListModel.singleById(retAdd.insertId);
                    const object = {
                        ID: retAdd.insertId,
                        Number: req.body.Number,
                        Name: takerName[0].Name
                    };
                    return res.send({
                        success: true,
                        object
                    });
                } else {
                    return res.send({
                        success: false,
                        message: 'Số tài khoản không hợp lệ'
                    })
                }
            })
            .catch(function(error) {
                console.log(error);
                return res.json({
                    success: false,
                    message: error
                });
            });
    }
    makePostRequest();
})

router.post('/add-money', async(req, res) => {
    // req.body = {
    //     Number_NG: '',
    //     Number_NN: '',
    //     Content: '',
    //     Money: ''
    //     Fee:'NN' or 'NG'
    //     Type: 'CHUYENKHOAN' 'NHACNO' | chuyển tiền - nhắc nợ
    // };

    const senderInfo = await AccNumModel.singleByNumber(req.body.Number_NG);

    //Xác thực mã OTP
    //lấy code lưu trong db ra để ss với code customer nhập vào
    const UserOTP = await UserOTPModel.singleByUserId(senderInfo[0].UserID)

    let checkTime = moment().unix() - UserOTP[0].Time; //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +UserOTP[0].Code || checkTime > 7200) { // 7200s == 3h
        return res.send({
            success: false,
            message: 'Invalid OTP code or expired OPT code'
        })
    }


    //ktra số dư người gửi
    if (req.body.Fee === 'NG') {
        if (+senderInfo[0].AccountBalance < (+req.body.Money + +config.transaction.ExternalBank)) { //số dư có bé hơn tiền gửi + phí hay k
            return res.send({ //TH ng gửi trả phí
                success: false,
                message: 'Balance is not enough for the transaction'
            })
        }
    } else {
        if (+senderInfo[0].AccountBalance < +req.body.Money) { //số dư có bé tiền gửi,TH gửi nhận trả phí
            return res.send({ //TH ng gửi trả phí
                success: false,
                message: 'Balance is not enough for the transaction'
            })
        }
    }


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

    //request gui nap tien
    const content_transfer = {
        number: req.body.Number_NN,
        amount: req.body.Money
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
                const dt = response.data;
                const decryptedMessage = Private_Key.decrypt(dt.messageResponse, 'utf8');
                console.log(JSON.parse(decryptedMessage));
                const RSAResponse = JSON.parse(decryptedMessage);

                const isValid = key.verify(JSON.parse(decryptedMessage), dt.signatureResponse, 'utf8', 'base64');
                console.log(`isValid: ${isValid}`);

                if (RSAResponse.success === true) {
                    //TÀI KHOẢN NGƯỜI GỬI
                    //trừ tiền vừa gửi
                    let senderBalance = +senderInfo[0].AccountBalance - (+req.body.Money);

                    //phí gửi
                    if (req.body.Fee === 'NG') {
                        senderBalance = +senderBalance - config.transaction.ExternalBank;
                    }

                    const newBalance2 = {
                        AccountBalance: senderBalance
                    };
                    //update lai so du tai khoan
                    const ret2 = await AccNumModel.updateMoney(senderInfo[0].UserID, newBalance2);

                    //thông tin giao dịch
                    const transInfo = {
                        ...req.body,
                        Time: moment().format('YYYY-MM-DD hh:mm:ss')
                    };

                    //lưu lại lịch sử giao dịch
                    await TransModel.add(transInfo);

                    //thêm vào bảng PartnerTransaction
                    const transInfoPartner = {
                        SendBank: 'HHBank',
                        TakeBank: 'Sacombank',
                        Money: req.body.Money,
                        Time: moment().format('YYYY-MM-DD hh:mm:ss')
                    };

                    await PartnerTransModel.add(transInfoPartner);

                    res.send({
                        success: true,
                        transInfo,
                        message: 'Successful Transaction'
                    });
                } else {
                    res.send({
                        success: false,
                        message: RSAResponse.message
                    });
                }

            })
            .catch(function(error) {
                console.log(error);
            });
    }

    makePostRequest();
})



//GỬI MÃ OPT
router.post('/otp', async(req, res) => {
    // req.body = {
    //     Number: ""
    // }

    const OTP = createOTP();
    const senderInfo = await UserAccModel.singleByNumber(req.body.Number);

    //email ngân hàng gửi mã OTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hhbank.service@gmail.com',
            pass: 'hhbank123456'
        }
    });

    console.log(`gmail: ${senderInfo[0].UserEmail}`);

    //email người nhận
    const mailOptions = {
        from: 'hhbank.service@gmail.com',
        to: senderInfo[0].UserEmail,
        subject: 'Xác thực mã OTP - HHBank',
        text: `Xin chào khách hàng ${senderInfo[0].UserName}
         Đây là mã OTP để xác thực giao dịch: ${OTP}
         Vui lòng xác thực trong vòng 2 giờ trước khi mã hết hạn
         Thân chào!`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send({
                success: false,
                message: error,
            })
            throw createError(401, 'Can not send email');
        }
        console.log('Email sent: ' + info.response);
        time = moment().unix();
    });

    const entity = {
        UserID: senderInfo[0].UserID,
        Code: OTP,
        Time: moment().unix()
    };
    await UserOTPModel.updateOTP(entity);

    res.send({
        success: true,
        OTP: OTP
    });
})


const createOTP = () => {
    let OTPcode = '';
    for (var i = 0; i < 6; i++) {
        OTPcode += Math.floor(Math.random() * (9 - 0) + 0);
    }
    return OTPcode;
}



module.exports = router;