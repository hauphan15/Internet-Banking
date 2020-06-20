const express = require('express');
const AminModel = require('../../models/Admin.model');

const router = express.Router();


//thêm admin
router.post('/add-admin', async(req, res) => {
    // entity = {
    //     "UserName": "",
    //     "UserPassword": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": "",
    //     "DoB": "",
    // }

    const retAdd = await AminModel.add(req.body);

    res.status(201).json({
        ID: retAdd.insertId,
    });
})

module.exports = router;