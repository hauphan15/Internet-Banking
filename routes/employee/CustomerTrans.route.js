const express = require('express');
const AccNumberModel = require('../../models/AccountNumber.model');
const TransactionModel = require('../../models/Transaction.model');
const SavingAccModel = require('../../models/SavingAccount.model');
const moment = require('moment');

const router = express.Router();

//nạp tiền vào tk thanh toán
router.post('/addmoney-spendingacc', async(req, res) => {
    // req.body = {
    //     Number: "",
    //     Money: ""
    // }

    const takerInfo = await AccNumberModel.singleByNumber(req.body.Number);
    if (takerInfo.length === 0) {
        return res.send({
            success: false,
            message: 'Number not found'
        })
    }

    //cộng với tiền nạp dô
    const balance = +takerInfo[0].AccountBalance + (+req.body.Money);

    const newBalance = {
        AccountBalance: balance
    };
    //update lai so du tai khoan
    const result = await AccNumberModel.updateMoney(takerInfo[0].UserID, newBalance);

    if (result.changedRows === 1) {
        return res.send({
            success: true,
            message: 'Successfully update balance'
        })
    } else {
        return res.send({
            success: false,
            message: 'Failed update balance'
        })
    }
})


//nạp tiền vào tài khoản tiết kiệm
router.post('/addmoney-savingacc', async(req, res) => {
    // req.body = {
    //     Number: "",
    //     Money: ""
    // }

    const takerInfo = await SavingAccModel.singleByNumber(req.body.Number);
    if (takerInfo.length === 0) {
        return res.send({
            success: false,
            message: 'Number not found'
        })
    }

    //cộng với tiền nạp dô
    const balance = +takerInfo[0].Balance + (+req.body.Money);

    const newBalance = {
        Balance: balance
    };
    //update lai so du tai khoan
    const result = await SavingAccModel.updateMoney(takerInfo[0].UserID, newBalance);

    if (result.changedRows === 1) {
        return res.send({
            success: true,
            message: 'Successfully update balance'
        })
    } else {
        return res.send({
            success: false,
            message: 'Failed update balance '
        })
    }
})


// THỐNG KÊ GIAO DỊCH 1 KHÁCH
//giao dịch nhân tiền
router.post('/history/take', async(req, res) => {
    // req.body = {
    //     "Number": ""
    // }
    const history = await TransactionModel.allTakeTrans(req.body.Number);
    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }
    res.send(history);
})

//giao dịch chuyển tiền
router.post('/history/send', async(req, res) => {
    // req.body = {
    //     "Number": ""
    // }

    const history = await TransactionModel.allSendTrans(req.body.Number);
    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }
    res.send(history);
})

//giao dịch về nhắc nợ | trả nợ người khác hoặc người khác trả nợ
router.post('/history/debt', async(req, res) => {
    // req.body = {
    //     "Number": ""
    // }
    const history = await TransactionModel.allDebTrans(req.body.Number);
    for (let index = 0; index < history.length; index++) {
        history[index].Time = moment(history[index].Time).format('DD-MM-YYYY hh:mm');
    }
    res.send(history);
})

module.exports = router;