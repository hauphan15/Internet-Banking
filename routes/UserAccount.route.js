const express = require('express');
const userAccountModel = require('../models/UserAccount.model');
const mongoose = require('mongoose');

const User = require('../DB/User.model');


const router = express.Router();


router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(+req.body.Number);
    const name = await userAccountModel.singleById(id[0].UserID);
    if (name.length === 0)
        return res.send('Number not found');
    res.json(name[0].UserName);
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