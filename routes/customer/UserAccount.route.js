const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const SavingAccModel = require('../../models/SavingAccount.model');
const AccNumberModel = require('../../models/AccountNumber.model');
const TransactionModel = require('../../models/Transaction.model');

const router = express.Router();

//Get all user
router.get('/', async(req, res) => {
    const ret = await userAccountModel.all();
    if (ret.length === 0) return;

    res.json(ret);
})

//lấy tất cả tài khoản tiết kiệm và tài khoản thanh toán của khách
router.post('/:userid', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }

    const savingAcc = await SavingAccModel.singleByUserId(req.params.userid);

    const spendingAcc = await AccNumberModel.singleById(req.params.userid);

    res.send({
        SpendingAccount: spendingAcc,
        SavingAccount: savingAcc
    })

})

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


module.exports = router;