const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const SavingAccModel = require('../../models/SavingAccount.model');
const AccNumberModel = require('../../models/AccountNumber.model');
const TransactionModel = require('../../models/Transaction.model');
const bcrypt = require('bcryptjs');


const router = express.Router();

//Get all user
router.get('/', async(req, res) => {
    const ret = await userAccountModel.all();
    if (ret.length === 0) return;

    res.json(ret);
})

//lấy tài khoảng thanh toán
router.post('/account/spending', async(req, res) => {
    const spendingAcc = await AccNumberModel.singleById(req.body.UserID);
    res.send(spendingAcc);
})

//lấy tài khoản tiết kiệm
router.post('/account/saving', async(req, res) => {
    const savingAcc = await SavingAccModel.singleByUserId(req.body.UserID);
    res.send(savingAcc);
})


// THỐNG KÊ GIAO DỊCH
//giao dịch nhân tiền
router.post('/history/take', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }

    const history = await TransactionModel.allTakeTrans(req.body.Number);
    res.send(history);
})

//giao dịch chuyển tiền
router.post('/history/send', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }

    const history = await TransactionModel.allSendTrans(req.body.Number);
    res.send(history);
})

//giao dịch về nhắc nợ | trả nợ người khác hoặc người khác trả nợ
router.post('/history/debt', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }
    const history = await TransactionModel.allDebTrans(req.body.Number);
    res.send(history);
})


//đổi mật khẩu
router.post('/changepw', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    //     "OldPassword":""
    //     "NewPassword":""
    //     "ConfirmPassword":""
    // }

    const rows = await userAccountModel.singleById(req.body.UserID);
    if (rows.length === 0) {
        return res.send({
            message: 'UserID not found'
        })
    }

    const hashPwd = rows[0].UserPassword;
    if (!bcrypt.compareSync(entity.OldPassword, hashPwd)) {
        return res.send({
            message: 'Old password is incorrect'
        })
    }

    if (req.body.NewPassword !== req.body.ConfirmPassword) {
        return res.send({
            message: 'New password and confirm password does not match'
        })
    }

    const updateObj = {
        UserID: req.body.UserID,
        NewPassword: req.body.NewPassword
    }
    const result = await userAccountModel.updatePassword(updateObj);

    if (result[0].changedRows === 0) {
        return res.send({
            success: true,
            message: 'Your password has been successfully updated'
        })
    } else {
        return res.send({
            success: false,
            message: 'Failed update password '
        })
    }
})


//quên mật khẩu

let time;

const createOTP = () => {
    let OTPcode = '';
    for (var i = 0; i < 6; i++) {
        OTPcode += Math.floor(Math.random() * (9 - 0) + 0);
    }
    return OTPcode;
}

const OTP = createOTP();

router.post('/misspw', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    //     "NewPassword":""
    //     "ConfirmPassword":""
    // }

    //Xác thực mã OTP

    let checkTime = moment().unix() - time; //kiểm tra hiệu lực mã OTP còn hiệu lực ko

    const optHeader = req.headers['x-otp-code'];

    if (+optHeader !== +OTP || checkTime > 3000) { // 3000s == 5m
        res.send({
            message: 'Invalid OTP code or expired OPT code'
        })
        throw createError(401, 'Invalid OTP code or expired OPT code');
    }

    const rows = await userAccountModel.singleById(req.body.UserID);
    if (rows.length === 0) {
        return res.send({
            message: 'UserID not found'
        })
    }

    if (req.body.NewPassword !== req.body.ConfirmPassword) {
        return res.send({
            message: 'New password and confirm password does not match'
        })
    }

    const updateObj = {
        UserID: req.body.UserID,
        NewPassword: req.body.NewPassword
    }
    const result = await userAccountModel.updatePassword(updateObj);

    if (result[0].changedRows === 0) {
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


//API that response user's informations for partner bank
router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(req.body.Number);
    if (id.length === 0) {
        res.json({
            success: false,
            message: 'Number not found'
        });
        throw createError(401, 'Number not found');
    }

    const name = await userAccountModel.singleById(id[0].UserID);
    res.json({
        success: true,
        data: name[0].FullName
    });
})



//GỬI MÃ OPT
router.post('/misspw/otp', async(req, res) => {

    const senderInfo = await UserAccModel.singleByNumber(req.body.Number);

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
        text: `Dear ${senderInfo[0].UserName}
         This is your OTP code for changing password: ${OTP}
         This code will expire 5 minutes later
        `
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