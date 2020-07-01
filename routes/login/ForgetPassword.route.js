const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const moment = require('moment');
const UserOTPModel = require('../../models/UserOTP.model');


const router = express.Router();

router.post('/', async(req, res) => {
    // req.body = {
    //     "UserName": "",
    //     "UserEmail": "",
    //     "NewPassword":""
    // }

    const user = await userAccountModel.singleByEmailAndUserName(req.body.UserEmail, req.body.UserName);

    //Xác thực mã OTP
    //lấy code lưu trong database ra để ss với code customer nhập vào
    const UserOTP = await UserOTPModel.singleByUserId(user[0].UserID)

    let checkTime = moment().unix() - UserOTP[0].Time; //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +UserOTP[0].Code || checkTime > 3000) { // 3000s = 5p
        return res.send({
            success: false,
            message: 'Invalid OTP code or expired OPT code'
        })
    }

    const updateObj = {
        UserID: user[0].UserID,
        NewPassword: req.body.NewPassword
    }
    const result = await userAccountModel.updatePassword(updateObj);

    if (result.changedRows === 1) {
        return res.send({
            success: true,
            message: 'Password has been successfully updated'
        })
    } else {
        return res.send({
            success: false,
            message: 'Failed update password '
        })
    }
})


//GỬI MÃ OPT
router.post('/otp', async(req, res) => {
    // req.body = {
    //     UserName: "",
    //     UserEmail: ""
    // }
    const OTP = createOTP();
    const senderInfo = await userAccountModel.singleByEmailAndUserName(req.body.UserEmail, req.body.UserName);

    if (senderInfo.length === 0) {
        return res.send({
            success: false,
            message: 'Email hoặc tên đăng nhập chưa đúng'
        })
    }

    //email người gửi
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
         Đây là mã OTP để đổi mật khẩu: ${OTP}
         Vui lòng xác thực trong vòng 5 phút trước khi mã hết hạn
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
    });

    const entity = {
        UserID: senderInfo[0].UserID,
        Code: OTP,
        Time: moment().unix()
    };
    await UserOTPModel.updateOTP(entity);

    res.send({
        success: true,
        OTP
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