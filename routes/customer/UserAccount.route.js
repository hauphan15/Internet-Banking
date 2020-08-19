const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const SavingAccModel = require('../../models/SavingAccount.model');
const AccNumberModel = require('../../models/AccountNumber.model');
const TransactionModel = require('../../models/Transaction.model');
const bcrypt = require('bcryptjs');
const moment = require('moment');


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

    delete spendingAcc[0].AccNumID;
    delete spendingAcc[0].UserID;
    res.json(spendingAcc);
})

//lấy tài khoản tiết kiệm
router.post('/account/saving', async(req, res) => {
    const savingAcc = await SavingAccModel.singleByUserId(req.body.UserID);

    if (history.savingAcc === 0) {
        return res.send(savingAcc);
    }

    delete savingAcc[0].ID;
    delete savingAcc[0].UserID;
    res.json(savingAcc);
})


// THỐNG KÊ GIAO DỊCH
//giao dịch nhân tiền
router.post('/history/take', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }
    const userInfo = await userAccountModel.singleById(req.body.UserID);
    const history = await TransactionModel.allTakeTrans(userInfo[0].Number);

    if (history.length === 0) {
        return res.send(history);
    }

    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }
    delete history[0].ID;
    delete history[0].Type;
    delete history[0].Fee;

    res.send(history);
})

//giao dịch chuyển tiền
router.post('/history/send', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }
    const userInfo = await userAccountModel.singleById(req.body.UserID);
    const history = await TransactionModel.allSendTrans(userInfo[0].Number);

    if (history.length === 0) {
        return res.send(history);
    }

    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }
    delete history[0].ID;
    delete history[0].Type;
    delete history[0].Fee;

    res.send(history);
})

//giao dịch về nhắc nợ | trả nợ người khác hoặc người khác trả nợ
router.post('/history/debt', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }
    const userInfo = await userAccountModel.singleById(req.body.UserID);
    const history = await TransactionModel.allDebTrans(userInfo[0].Number);

    if (history.length === 0) {
        return res.send(history);
    }

    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }

    delete history[0].ID;
    delete history[0].Type;
    delete history[0].Fee;

    res.send(history);
})


//đổi mật khẩu
router.post('/changepw', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    //     "OldPassword":""
    //     "NewPassword":""
    // }

    const rows = await userAccountModel.singleById(req.body.UserID);

    const hashPwd = rows[0].UserPassword;
    if (!bcrypt.compareSync(req.body.OldPassword, hashPwd)) {
        return res.send({
            success: false,
            message: 'Mật khẩu cũ không hợp lệ'
        })
    }


    const updateObj = {
        UserID: req.body.UserID,
        NewPassword: req.body.NewPassword
    }
    const result = await userAccountModel.updatePassword(updateObj);

    if (result.changedRows === 1) {
        return res.send({
            success: true,
            message: 'Cập nhật mật khẩu thành công'
        })
    } else {
        return res.send({
            success: false,
            message: 'Cập nhật mật khẩu thất bại'
        })
    }
})


//API that response user's informations for partner bank
router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(req.body.Number);
    if (id.length === 0) {
        return res.json({
            success: false,
            message: 'Number not found'
        });
    }

    const name = await userAccountModel.singleById(id[0].UserID);
    res.json({
        success: true,
        data: name[0].FullName
    });
})


//Đóng tài khoản
router.post('/removeacc', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    //     "Password":""
    // }

    const rows = await userAccountModel.singleById(req.body.UserID);

    const hashPwd = rows[0].UserPassword;
    if (!bcrypt.compareSync(req.body.Password, hashPwd)) {
        return res.send({
            success: false,
            message: 'Mật khẩu không hợp lệ'
        })
    }

    await userAccountModel.removeAccount(req.body.UserID);
    await SavingAccModel.removeAccount(req.body.UserID);
    await AccNumberModel.removeAccount(req.body.UserID);

    res.json({
        success: true,
        message: 'Xóa thành công'
    })
})

module.exports = router;