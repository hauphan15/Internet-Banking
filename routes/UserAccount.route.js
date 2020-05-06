const express = require('express');
const userAccountModel = require('../models/UserAccount.model');


const router = express.Router();





router.get('/', async function(req, res) {
    const listAcc = await userAccountModel.all();
    res.json(listAcc);
})



module.exports = router;