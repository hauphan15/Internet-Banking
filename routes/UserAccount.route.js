const express = require('express');
const userAccountModel = require('../models/UserAccount.model');


const router = express.Router();


router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(+req.body.Number);
    const name = await userAccountModel.singleById(id[0].UserID);
    if (name.length === 0)
        return res.send('Number not found');
    res.json(name[0].UserName);
})


module.exports = router;