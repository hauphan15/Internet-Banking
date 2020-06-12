const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const randToken = require('rand-token');

const router = express.Router();


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