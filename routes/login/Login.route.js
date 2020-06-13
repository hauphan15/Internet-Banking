const express = require('express');
const userAccountModel = require('../../models/UserAccount.model');
const EmployeeModel = require('../../models/Employee.model');
const AdminModel = require('../../models/Admin.model');
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

    const employeeId = ret.employeeId;

    const accessToken = generateAccessToken(employeeId);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await userAccountModel.updateRefreshToken(employeeId, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    })
})



//Employee login
router.post('/employee-login', async(req, res) => {
    // req.body = {
    //   "UserName": "",
    //   "UserPassword": ""
    // }

    const ret = await EmployeeModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false
        })
    }

    const EmployeeID = ret.ID;

    const accessToken = generateAccessToken(EmployeeID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await EmployeeModel.updateRefreshToken(EmployeeID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    })
})


//Admin login
router.post('/admin-login', async(req, res) => {
    // req.body = {
    //   "UserName": "",
    //   "UserPassword": ""
    // }

    const ret = await AdminModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false
        })
    }

    const AdminID = ret.ID;

    const accessToken = generateAccessToken(AdminID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await AdminModel.updateRefreshToken(AdminID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    })
})


//customer  refresh token
router.post('/user-refresh', async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(req.body.accessToken, config.auth.secret, { ignoreExpiration: true }, async function(err, payload) {
        const { userId } = payload;
        const ret = await userAccountModel.verifyRefreshToken(userId, req.body.refreshToken);
        if (ret === false) {
            throw createError(400, 'Invalid refresh token.');
        }

        const accessToken = generateAccessToken(userId);
        res.json({ accessToken });
    })
});


//employee refresh token
router.post('/employee-refresh', async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(req.body.accessToken, config.auth.secret, { ignoreExpiration: true }, async function(err, payload) {
        const { employeeId } = payload;
        const ret = await EmployeeModel.verifyRefreshToken(employeeId, req.body.refreshToken);
        if (ret === false) {
            throw createError(400, 'Invalid refresh token.');
        }

        const accessToken = generateAccessToken(employeeId);
        res.json({ accessToken });
    })
});

//admin refresh token
router.post('/admin-refresh', async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(req.body.accessToken, config.auth.secret, { ignoreExpiration: true }, async function(err, payload) {
        const { adminId } = payload;
        const ret = await AdminModel.verifyRefreshToken(adminId, req.body.refreshToken);
        if (ret === false) {
            throw createError(400, 'Invalid refresh token.');
        }

        const accessToken = generateAccessToken(adminId);
        res.json({ accessToken });
    })
});


const generateAccessToken = employeeId => {
    const payload = { employeeId };
    const accessToken = jwt.sign(payload, config.auth.secret, {
        expiresIn: config.auth.expiresIn
    });

    return accessToken;
}









//generate token with jwt module
const generateAccessToken = employeeId => {
    const payload = { employeeId };
    const accessToken = jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn
    });

    return accessToken;
}

module.exports = router;