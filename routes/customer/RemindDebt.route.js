const express = require("express");
const UserAccModel = require("../../models/UserAccount.model");
const DebtorModel = require("../../models/Debtor.model");

const router = express.Router();

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

    console.log(debtorInfo);

    const entity = {
        CreatorID: req.body.CreatorID,
        CreditorID: req.body.CreditorID,
        DebtorID: debtorInfo[0].UserID,
        Money: req.body.Money,
        Content: req.body.Content,
        DeletedContent: "no",
        Status: "no",
    };
    const result = await DebtorModel.Add(entity);

    res.json({
        CreatorID: req.body.CreatorID,
        CreditorID: req.body.CreditorID,
        DebtorNumber: req.body.DebtorNumber,
        Money: req.body.Money,
        Content: req.body.Content,
        DeletedContent: "no",
        Status: "no",
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