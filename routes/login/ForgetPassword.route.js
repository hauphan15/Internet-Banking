const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const moment = require('moment');


const router = express.Router();

let time;
const createOTP = () => {
    let OTPcode = '';
    for (var i = 0; i < 6; i++) {
        OTPcode += Math.floor(Math.random() * (9 - 0) + 0);
    }
    return OTPcode;
}
const OTP = createOTP();

router.post('/', async(req, res) => {
    // req.body = {
    //     "UserName": "",
    //     "UserEmail": "",
    //     "NewPassword":""
    // }

    //Xác thực mã OTP
    let checkTime = moment().unix() - time; //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +OTP || checkTime > 3000) { // 3000s == 5m
        res.send({
            success: false,
            message: 'Invalid OTP code or expired OPT code'
        })
        throw createError(401, 'Invalid OTP code or expired OPT code');
    }

    const user = await userAccountModel.singleByEmailAndUserName(req.body.UserEmail, req.body.UserName);
    if (user.length === 0) {
        res.send({
            success: false,
            message: 'Email not found'
        })
        throw createError(401, 'Email not found');
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

    const senderInfo = await userAccountModel.singleByEmailAndUserName(req.body.UserEmail, req.body.UserName);

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
        subject: 'OTP Verification - HHBank',
        text: `
        Dear ${senderInfo[0].UserName}
        This is your OTP code
        for changing password: ${OTP}
        This code will expire 5 minutes later `
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

    res.send({
        success: true,
        OTP
    });
})

module.exports = router;