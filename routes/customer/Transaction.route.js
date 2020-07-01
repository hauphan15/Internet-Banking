const express = require('express');
const AccNumModel = require('../../models/AccountNumber.model');
const TransModel = require('../../models/Transaction.model');
const createError = require('http-errors');
const moment = require('moment');
const config = require('../../config/default.json');
const nodemailer = require('nodemailer');
const UserAccModel = require('../../models/UserAccount.model');
const UserOTPModel = require('../../models/UserOTP.model');


const router = express.Router();


//GIAO DỊCH CHUYỂN TIỀN NỘI BỘ
router.post('/transaction', async function(req, res) {

    // req.body = {
    //     Number_NG: '',
    //     Number_NN: '',
    //     Content: '',
    //     Money: ''
    //     Fee:'NN' or 'NG'
    //     Type: 'CHUYENKHOAN' 'NHACNO' | chuyển tiền - nhắc nợ
    // };

    const takerInfo = await AccNumModel.singleByNumber(req.body.Number_NN);
    if (takerInfo.length === 0) {
        return res.send({
            success: false,
            message: 'Số tài khoản người nhận không hợp lệ'
        })
    }

    const senderInfo = await AccNumModel.singleByNumber(req.body.Number_NG);

    //Xác thực mã OTP
    //lấy code lưu trong db ra để ss với code customer nhập vào
    const UserOTP = await UserOTPModel.singleByUserId(senderInfo[0].UserID)

    let checkTime = moment().unix() - UserOTP[0].Time; //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +UserOTP[0].Code || checkTime > 7200) { // 7200s == 3h
        return res.send({
            success: false,
            message: 'Mã OTP không hợp lệ hoặc hết hạn'
        })
    }

    const transInfo = {
        ...req.body,
        Time: moment().format('YYYY-MM-DD hh:mm:ss')
    };

    var result;
    //ktra số dư người gửi
    if (req.body.Fee === 'NG') {
        if (+senderInfo[0].AccountBalance < (+req.body.Money + +config.transaction.InternaBank)) { //số dư có bé hơn tiền gửi + phí hay k
            result = { //TH ng gửi trả phí
                success: false,
                message: 'Số dư không đủ cho phiên giao dịch'
            }
            return res.send(result);
        }
    } else {
        if (+senderInfo[0].AccountBalance < +req.body.Money) { //số dư có bé tiền gửi,TH gửi nhận trả phí
            result = {
                success: false,
                message: 'Số dư không đủ cho phiên giao dịch'
            }
            return res.send(result);
        }
    }

    //ktra tài khoản người gửi có tồn tại
    if (senderInfo.length === 0) {
        result = {
            success: false,
            message: 'Tài khoản người gửi không tồn tại'
        }
        return res.send(result);
    }


    //TÀI KHOẢN NGƯỜI NHẬN
    //cộng với tiền nạp dô
    let takerBalance = +takerInfo[0].AccountBalance + (+req.body.Money);

    //phí gửi
    if (req.body.Fee === 'NN') {
        takerBalance = +takerBalance - config.transaction.InternaBank;
    }

    const newBalance1 = {
        AccountBalance: takerBalance
    };
    //update lai so du tai khoan
    const ret1 = await AccNumModel.updateMoney(takerInfo[0].UserID, newBalance1);


    //TÀI KHOẢN NGƯỜI GỬI
    //trừ tiền vừa gửi
    let senderBalance = +senderInfo[0].AccountBalance - (+req.body.Money);

    //phí gửi
    if (req.body.Fee === 'NG') {
        senderBalance = +senderBalance - config.transaction.InternaBank;
    }

    const newBalance2 = {
        AccountBalance: senderBalance
    };
    //update lai so du tai khoan
    const ret2 = await AccNumModel.updateMoney(senderInfo[0].UserID, newBalance2);


    if (ret1.changedRows === 1 && ret2.changedRows === 1) {
        result = {
            success: true,
            message: 'Giao dịch thành công'
        }
    } else {
        result = {
            success: false,
            message: 'Giao dịch thất bại'
        }
    }

    //lưu lại lịch sử giao dịch
    await TransModel.add(transInfo);

    //response trả về
    res.send({
        success: result.success,
        transInfo
    });
})



//GỬI MÃ OPT
router.post('/trans/otp', async(req, res) => {
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