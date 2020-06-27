const express = require("express");
const UserAccModel = require("../../models/UserAccount.model");
const DebtorModel = require("../../models/Debtor.model");

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

    if (debtorInfo === null) {
        return res.json({ success: false });
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
        success: true
    });
});

router.post('/debtorlist', async(req, res) => {
    const rows = await DebtorModel.getDebtor(req.body.UserID);
    if(rows === null) {
        return res.json({success: false});
    }

    const items = [];

    for( var i = 0; i < rows.length ; i++){
        const user = await UserAccModel.singleById(rows[i].debtorID);
        var item = {
            FullName: user[0].FullName,
            Number: user[0].Number,
            Money: rows[i].money
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
    if(rows === null) {
        return res.json({success: false});
    }

    const items = [];

    for( var i = 0; i < rows.length ; i++){
        const user = await UserAccModel.singleById(rows[i].creatorID);
        var item = {
            FullName: user[0].FullName,
            Number: user[0].Number,
            Money: rows[i].money
        }
        items.push(item);
    }
    res.json({
        success: true,
        list: items
    });
})

module.exports = router;