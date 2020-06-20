const express = require("express");
const UserModel = require("../../models/UserAccount.model");
const DebtorModel = require("../../models/Debtor.model");

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello");
});

router.post("/create", async function (req, res) {
  const debtor = await UserModel.singleByNumber(req.body.debtorNumber);

  if (debtor == null) {
    return res.json({ result: false });
  }

  console.log(debtor);

  const entity = {
    CreditorID: req.body.CreditorID,
    DebtorID: debtor[0].UserID,
    Money: req.body.Money,
    Content: req.body.Content,
    DeletedContent: "no",
    Status: "no",
  };
  const result = await DebtorModel.Add(entity);

  res.json({
    result: true,
  });
});

router.get('/mydebtorlist', async (req, res) => {
    const rows = await DebtorModel.getDebtor(req.body.UserID);

    if(rows.length == 0) {
        return res.json({message: "No debtor found"});
    }

    res.json(rows);
})

router.get('/mycreditorlist', async (req, res) => {
    const rows = await DebtorModel.getCreditor(req.body.UserID);

    if(rows.length == 0) {
        return res.json({message: "No Creditor found"});
    }

    res.json(rows);
})

module.exports = router;
