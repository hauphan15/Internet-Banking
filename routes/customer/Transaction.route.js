const express = require('express');
const AccNumModel = require('../../models/AccountNumber.model');
const TransModel = require('../../models/Transaction.model');
const createError = require('http-errors');
const moment = require('moment');
const config = require('../../config/default.json');

const router = express.Router();


router.post('/trans/add', async function(req, res) {

    // req.body = {
    //     Number_NG: '',
    //     Number_NN: '',
    //     Content: '',
    //     Money: ''
    //     Fee:'NN' or 'NG'
    // };

    const transInfo = {
        ...req.body,
        Type: 'CT',
        Time: moment().format('YYYY-MM-DD hh:mm:ss')
        ``
    };

    const takerInfo = await AccNumModel.singleByNumber(req.body.Number_NN);
    console.log(takerInfo);
    const senderInfo = await AccNumModel.singleByNumber(req.body.Number_NG);
    console.log(senderInfo);

    var result;

    //ktra tài khoản người nhận có tồn tại
    if (takerInfo.length === 0) {
        result = {
            success: false,
            message: 'TakerNumber not found'
        }
        res.send(result);
        throw createError(401, 'TakerNumber not found');
    }


    //ktra số dư người gửi
    if (req.body.Fee === 'NG') {
        if (+senderInfo.AccountBalance < (+req.body.Money + +config.transaction.InternaBank)) {
            result = {
                success: false,
                message: 'Balance is not enough for the transaction'
            }
            res.send(result);
            throw createError(401, 'Balance is not enough for the transaction');
        }
    } else {
        if (+senderInfo.AccountBalance < +req.body.Money) {
            result = {
                success: false,
                message: 'Balance is not enough for the transaction'
            }
            res.send(result);
            throw createError(401, 'Balance is not enough for the transaction');
        }
    }

    //ktra tài khoản người gửi có tồn tại
    if (senderInfo.length === 0) {
        result = {
            success: false,
            message: 'SenderNumber not found'
        }
        res.send(result);
        throw createError(401, 'SenderNumber not found');
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
            message: 'Successful Transaction'
        }
    } else {
        result = {
            success: false,
            message: 'Failed Transaction'
        }
    }


    //LƯU LẠI LỊCH SỬ GIAO DỊCH 
    await TransModel.add(transInfo);

    //response trả về
    res.send(result);
})


module.exports = router;