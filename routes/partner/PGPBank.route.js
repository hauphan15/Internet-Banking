const express = require('express');
const openpgp = require('openpgp')
const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');
const PartnerTransModel = require('../../models/PartnerTransaction.model');
const TransModel = require('../../models/Transaction.model');
const UserAccModel = require('../../models/UserAccount.model');
const AccNumModel = require('../../models/AccountNumber.model');
const nodemailer = require('nodemailer');
const config = require('../../config/default.json');
const UserOTPModel = require('../../models/UserOTP.model');
const TakerListModel = require('../../models/TakerList.model');


const router = express.Router();


router.post('/get-info', (req, res) => {

    // req.body = {
    //     "UserID": "",
    //      "Name": "",
    //     "Number": ""
    // }

    const body = {
        accountNumber: +req.body.Number,
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
            .then(async function(response) {
                console.log(response.data);
                const result = response.data;
                // result = {
                //     id: '1',
                //     createdAt: '2020-07-04T04:30:54.263Z',
                //     updatedAt: '2020-07-04T04:45:07.605Z',
                //     name: 'Hoàng Dân An',
                //     accountNumber: '10000000'
                // };
                if (true) {

                    let name = req.body.Name;
                    if (name === '') { //nếu k nhập tên gợi nhớ thì lấy tên đăng ký
                        name = result.name;
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
                    message: 'Gửi request thất bại'
                })
            });
    }
    makePostRequest();
})


router.post('/add-money', async(req, res) => {
    //hhbank key
    const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org      

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
3q1A
=/0ZM
-----END PGP PUBLIC KEY BLOCK-----`;
    const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v4.10.4
Comment: https://openpgpjs.org

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
bYr+EdyxjzPTPmuiUqwCIMwH2t6tQA==
=KWRc
-----END PGP PRIVATE KEY BLOCK-----`;

    const passphrase = `mrhauphan`;

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

    let checkTime = moment().unix() - (+UserOTP[0].Time); //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +UserOTP[0].Code || checkTime > 7200) { // 7200s == 3h
        return res.send({
            success: false,
            message: 'Mã OTP không hợp hoặc đã hết hạn'
        })
    }

    //ktra số dư người gửi
    if (req.body.Fee === 'NG') {
        if (+senderInfo[0].AccountBalance < (+req.body.Money + +config.transaction.ExternalBank)) { //số dư có bé hơn tiền gửi + phí hay k
            return res.send({ //TH ng gửi trả phí
                success: false,
                message: 'Số dư tài khoản không đủ để thực hiện giao dịch'
            })
        }
    } else {
        if (+senderInfo[0].AccountBalance < +req.body.Money) { //số dư có bé hơn tiền gửi,TH gửi nhận trả phí
            return res.send({ //TH ng gửi trả phí
                success: false,
                message: 'Số dư tài khoản không đủ để thực hiện giao dịch'
            })
        }
    }


    //public key cua partner pgp
    const partnerPubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto

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
FxzP2+m6kXwJBnolqhvtIYW1rw==
=qdcE
-----END PGP PUBLIC KEY BLOCK-----`;

    const signAndVerify = async() => {
        const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0]
        await privKeyObj.decrypt(passphrase)

        const data = {
            accountNumber: req.body.Number_NN,
            amount: req.body.Money
        };

        const { signature } = await openpgp.sign({
            detached: true,
            message: openpgp.cleartext.fromText(JSON.stringify(data)),
            privateKeys: [privKeyObj]
        });

        const body = {
            data: data,
            signature: signature
        };

        const username = 'nhom16';
        const password = 'nhom16';
        const hash = crypto.createHmac('md5', 'webnangcao_hash').update(JSON.stringify(body)).digest('hex');


        function makePostRequest() {
            axios.post('https://beohoang98-bank-dev.herokuapp.com/api/partner/send/v2', body, {
                    auth: {
                        username,
                        password
                    },
                    headers: {
                        'x-partner-hash': hash,
                        'x-partner-time': moment().unix().toString(),
                    }
                })
                .then(async function(response) {

                    const dt = response.data;
                    console.log(dt);

                    //const partnerSig = response.data.signature;
                    // const verified = await openpgp.verify({
                    //     message: openpgp.cleartext.fromText(JSON.stringify(dt)),
                    //     signature: await openpgp.signature.readArmored(partnerSig),
                    //     publicKeys: (await openpgp.key.readArmored(partnerPubkey)).keys
                    // });

                    // const { valid } = verified.signatures[0];
                    // if (valid) {
                    //     console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
                    // } else {
                    //     throw new Error('signature could not be verified');
                    // }


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
                        TakeBank: 'Nhom16',
                        Money: req.body.Money,
                        Time: moment().format('YYYY-MM-DD hh:mm:ss')
                    };

                    await PartnerTransModel.add(transInfoPartner);

                    res.send({
                        success: true,
                        transInfo,
                        message: 'Successful transaction'
                    });

                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        makePostRequest();
    }
    signAndVerify();
})


//GỬI MÃ OPT
router.post('/otp', async(req, res) => {
    // req.body = {
    //     Number: "",
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