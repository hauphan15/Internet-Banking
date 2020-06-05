const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const randToken = require('rand-token');

const router = express.Router();

//Get all user
router.get('/', async(req, res) => {
    const ret = await userAccountModel.all();
    if (ret.length === 0) return;

    res.json(ret);
})


//API that response user's informations for partner bank
router.post('/info', async function(req, res) {
    const id = await userAccountModel.singleByNumber(req.body.Number);
    if (id.length === 0) {
        res.json({
            success: false,
            message: 'Number not found'
        });
        throw createError(401, 'Number not found');
    }

    const name = await userAccountModel.singleById(id[0].UserID);
    res.json({
        success: true,
        data: name[0].FullName
    });
})

//Customer login
router.post('/login', async(req, res) => {
    // req.body = {
    //   "UserName": "mr.hauphan",
    //   "UserPassword": "mr.hauphan"
    // }

    const ret = await userAccountModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false
        })
    }

    const UserID = ret.UserID;

    const accessToken = generateAccessToken(UserID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await userAccountModel.updateRefreshToken(UserID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    })
})

//generate token with jwt module
const generateAccessToken = UserID => {
    const payload = { UserID };
    const accessToken = jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn
    });

    return accessToken;
}

module.exports = router;