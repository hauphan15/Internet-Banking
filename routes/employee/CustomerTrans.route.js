const express = require('express');
const AccNumberModel = require('../../models/AccountNumber.model');
const TransactionModel = require('../../models/Transaction.model');

const router = express.Router();

//nạp tiền vào tk khách
router.post('/', async(req, res) => {
    // req.body = {
    //     Number: "",
    //     Money: ""
    // }

    const takerInfo = await AccNumberModel.singleByNumber(req.body.Number);
    if (row.length === 0) {
        return res.send({
            message: 'Number not found'
        })
    }

    //cộng với tiền nạp dô
    const balance = +takerInfo[0].AccountBalance + (+req.body.Money);

    const newBalance = {
        AccountBalance: balance
    };
    //update lai so du tai khoan
    const result = await AccNumModel.updateMoney(takerInfo[0].UserID, newBalance);

    if (result[0].changedRows === 0) {
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

module.exports = router;