const express = require('express');
const userAccountModel = require('../models/UserAccount.model');
const createError = require('http-errors');

const router = express.Router();


router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(req.body.Number);
    if (id.length <= 0) {
        res.send('Number not found');
        throw createError(401, 'Number not found');
    }

    const name = await userAccountModel.singleById(id[0].UserID);
    res.json(name[0].UserName);
})


module.exports = router;