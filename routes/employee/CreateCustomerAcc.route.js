const express = require('express');
const UserAccModel = require('../../models/UserAccount.model');
const AccNumberModel = require('../../models/AccountNumber.model');
const SavingAccModel = require('../../models/SavingAccount.model');
const createError = require('http-errors');



const router = express.Router();

//create an account by employee
router.post('/create-acc', async(req, res) => {
    // req.body = {
    //     "UserName": "",
    //     "Password": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": ""
    // }

    console.log(req.body);

    //kiểm tra username
    const usrname = await UserAccModel.singleByUserName(req.body.UserName);
    if (usrname.length > 0) {
        return res.send({
            success: false,
            message: 'Username already exists'
        })
    }

    //random number account
    let SpendingAccNumber = '';
    for (var i = 0; i < 16; i++) {
        SpendingAccNumber += Math.floor(Math.random() * (9 - 0) + 0);
    }

    //add USER ACCOUNT
    const account = {
        Number: SpendingAccNumber,
        UserRole: 'customer',
        ...req.body
    };
    const result = await UserAccModel.add(account);

    //auto generate SPENDING ACCOUNT
    const accNum = {
        UserID: result.insertId,
        AccountBalance: '0',
        Number: SpendingAccNumber
    };
    const retSpendingAcc = await AccNumberModel.add(accNum);

    //response
    res.status(201).json({
        success: true,
        UserAcc: result.insertId,
        SpendingAccount: retSpendingAcc.insertId,
        Number: SpendingAccNumber
    });
})

//tạo tk tiết kiệm
router.post('/create-savingacc', async(req, res) => {
    // req.body = {
    //     "UserName": "",
    // }

    //kiểm tra username
    const userInfo = await UserAccModel.singleByUserName(req.body.UserName);
    if (userInfo.length === 0) {
        return res.send({
            success: false,
            message: 'Username not found'
        })
    }

    //random number account
    let savingAccNumber = '';
    for (var i = 0; i < 16; i++) {
        savingAccNumber += Math.floor(Math.random() * (9 - 0) + 0);
    }

    const account = {
        UserID: userInfo[0].UserID,
        Balance: '0',
        Number: savingAccNumber
    };
    const retSavingAcc = await SavingAccModel.add(account);

    //response
    res.status(201).json({
        success: true,
        SpendingAccount: retSavingAcc.insertId,
        Number: savingAccNumber
    });
})

module.exports = router;