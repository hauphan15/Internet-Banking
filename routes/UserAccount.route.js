const express = require('express');
const userAccountModel = require('../models/UserAccount.model');


const router = express.Router();


router.post('/infor', async function(req, res) {
    const listAcc = await userAccountModel.single(req.body.UserID);
    if (listAcc.length === 0)
        return res.send('UserId not found');
    res.json(listAcc[0]);
})


module.exports = router;