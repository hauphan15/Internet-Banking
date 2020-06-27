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
    //     "Money": ""
    //     "Content": "",
    // }

    const debtorInfo = await UserAccModel.singleByNumber(req.body.DebtorNumber);

    if (debtorInfo === null) {
        return res.json({ success: false });
    }

    console.log(debtorInfo);

    const entity = {
        creatorID: req.body.CreatorID,
        debtorID: debtorInfo[0].UserID,
        content: req.body.Content,
        money: req.body.Money,
        status: 1
    };
    const result = await DebtorModel.Add(entity);
    const object = {
        ID: result.insertId,
        CreatorID: req.body.CreatorID,
        DebtorNumber: req.body.DebtorNumber,
        DebotrName: debtorInfo[0].Fullname,
        Money: req.body.Money,
        Content: req.body.Content
    };
    res.json({
        success: true,
        object
    });
});

router.post('/mydebtorlist', async(req, res) => {
    const rows = await DebtorModel.getDebtor(req.body.UserID);
    res.json(rows);
})

router.post('/mycreditorlist', async(req, res) => {
    const rows = await DebtorModel.getCreditor(req.body.UserID);
    res.json(rows);
})

module.exports = router;