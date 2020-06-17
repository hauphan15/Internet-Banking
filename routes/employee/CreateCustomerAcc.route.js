const express = require('express');
const UserAccModel = require('../../models/UserAccount.model');
const AccNumberModel = require('../../models/AccountNumber.model');
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
        res.send({
            message: 'Username already exists'
        })
        throw createError(401, 'Username already exists');
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
        UserAcc: result.insertId,
        SpendingAccount: retSpendingAcc.insertId,
    });
})

module.exports = router;