const express = require('express');
const UserAccModel = require('../../models/UserAccount.model');

const router = express.Router();

router.post('/create-acc', async(req, res) => {
    const result = await UserAccModel.add(req.body);
    const ret = {
        id: result.insertId,
        ...req.body
    }

    res.status(201).json(ret);
})

module.exports = router;