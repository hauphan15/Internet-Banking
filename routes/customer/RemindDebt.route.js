const express = require("express");
const UserAccModel = require("../../models/UserAccount.model");
const DebtorModel = require("../../models/Debtor.model");
const nodemailer = require('nodemailer');

const router = express.Router();

router.get("/", (req, res) => {
    res.json("hello");
})

router.post("/create", async function(req, res) {
    // req.body = {
    //     "CreatorID ": "",
    //     "DebtorNumber": "",
    //     "Content": ""
    // }

    const debtorInfo = await UserAccModel.singleByNumber(req.body.DebtorNumber);

    if (debtorInfo.length === 0) {
        return res.json({
            success: false,
            message: 'Số tài khoản không hợp lệ'
        });
    }

    const entity = {
        creatorID: req.body.CreatorID,
        debtorID: debtorInfo[0].UserID,
        content: req.body.Content,
        money: req.body.Money,
        status: 1
    };
    console.log(entity);
    const result = await DebtorModel.Add(entity);

    res.json({
        success: true,
        message: 'Gửi nhắc nợ thành công'
    });
});

router.post('/delete', async(req, res) => {
    const user = await UserAccModel.singleByNumber(req.body.Number);
    if (user === null) {
        return res.json({ success: false });
    }


    if (req.body.isdebtor) {
        const entity = {
            CreatorID: user[0].UserID,
            DebtorID: req.body.UserID,
            Content: req.body.Content,
            Money: req.body.Money
        }
        await DebtorModel.Delete(entity);
    } else {
        const entity = {
            CreatorID: req.body.UserID,
            DebtorID: user[0].UserID,
            Content: req.body.Content,
            Money: req.body.Money
        }
        console.log(entity);
        await DebtorModel.Delete(entity);
    }

    res.json({ success: true })
})

router.post('/debtorlist', async(req, res) => {
    const rows = await DebtorModel.getDebtor(req.body.UserID);
    if (rows === null) {
        return res.json({ success: false });
    }

    const items = [];

    for (var i = 0; i < rows.length; i++) {
        const user = await UserAccModel.singleById(rows[i].debtorID);
        var item = {
            FullName: user[0].FullName,
            Number: user[0].Number,
            Money: rows[i].money,
            Content: rows[i].content
        }
        items.push(item);
    }
    res.json({
        success: true,
        list: items
    });
})

router.post('/creatorlist', async(req, res) => {
    const rows = await DebtorModel.getCreditor(req.body.UserID);
    if (rows === null) {
        return res.json({ success: false });
    }

    const items = [];

    for (var i = 0; i < rows.length; i++) {
        const user = await UserAccModel.singleById(rows[i].creatorID);
        var item = {
            FullName: user[0].FullName,
            Number: user[0].Number,
            Money: rows[i].money,
            Content: rows[i].content
        }
        items.push(item);
    }
    res.json({
        success: true,
        list: items
    });
})

router.post('/notify', async(req, res) => {

    const senderInfo = await UserAccModel.singleByNumber(req.body.Number);
    const user = await UserAccModel.singleById(req.body.UserID);

    //email người gửi
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hhbank.service@gmail.com',
            pass: 'hhbank123456'
        }
    });

    //email người nhận
    const mailOptions = {
        from: 'hhbank.service@gmail.com',
        to: senderInfo[0].UserEmail,
        subject: 'HHBank - Thông báo:',
        text: `Chào khách hàng ${senderInfo[0].FullName}
        Nhắc nợ của bạn: ${req.body.Content} - ${req.body.Money} đã được xóa bởi ${user[0].FullName} 
        Thân chào!
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
    });
})

module.exports = router;