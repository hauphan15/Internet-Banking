const express = require('express');
const userAccountModel = require('../models/UserAccount.model');
const mongoose = require('mongoose');

const User = require('../DB/User.model');


const router = express.Router();


router.post('/infor', async function(req, res) {
    const listAcc = await userAccountModel.single(req.body.UserID);
    if (listAcc.length === 0)
        return res.send('UserId not found');
    res.json(listAcc[0]);
})

router.post('/add', function(req,res){
    const newUser = new User({
        id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        money: 0,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save()
    .then(result => {
        console.log(result);
    }).catch(err =>{
        console.log(err);
    })

    res.status(201).json({
        message: "create successful",
        user: newUser
    })


})


module.exports = router;