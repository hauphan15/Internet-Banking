const express = require("express");
const userAccountModel = require("../../models/UserAccount.model");
const EmployeeModel = require("../../models/Employee.Model");
const AdminModel = require("../../models/Admin.model");
const jwt = require("jsonwebtoken");
const config = require("../../config/default.json");
const randToken = require("rand-token");

const router = express.Router();

//Customer login
router.post("/login", async(req, res) => {
    // req.body = {
    //   "UserName": "mr.hauphan",
    //   "UserPassword": "mr.hauphan"
    // }

    const ret = await userAccountModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false,
        });
    }

    const UserID = ret.UserID;

    const accessToken = generateAccessToken(UserID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await userAccountModel.updateRefreshToken(UserID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken,
        UserID,
        FullName: ret.FullName,
    });
});

//Employee login
router.post("/employee-login", async(req, res) => {
    // req.body = {
    //   "UserName": "",
    //   "UserPassword": ""
    // }

    const ret = await EmployeeModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false,
        });
    }

    const EmployeeID = ret.ID;

    const accessToken = generateAccessToken(EmployeeID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await EmployeeModel.updateRefreshToken(EmployeeID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken,
    });
});

//Admin login
router.post("/admin-login", async(req, res) => {
    // req.body = {
    //   "UserName": "",
    //   "UserPassword": ""
    // }

    const ret = await AdminModel.login(req.body);
    if (ret === null) {
        return res.json({
            authenticated: false,
        });
    }

    const AdminID = ret.ID;

    const accessToken = generateAccessToken(AdminID);

    const refreshToken = randToken.generate(config.token.refreshTokenSz);
    await AdminModel.updateRefreshToken(AdminID, refreshToken);

    res.json({
        authenticated: true,
        accessToken,
        refreshToken,
    });
});

//customer  refresh token
router.post("/user-refresh", async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(
        req.body.accessToken,
        config.token.secret, { ignoreExpiration: true },
        async function(err, payload) {
            const userId = req.body.id;
            const ret = await userAccountModel.verifyRefreshToken(
                userId,
                req.body.refreshToken
            );
            if (ret === false) {
                return res.json({
                    result: false
                });
                //throw createError(400, "Invalid refresh token.");
            }

            const accessToken = generateAccessToken(userId);
            res.json({ accessToken, result: true });
        }
    );
});

//employee refresh token
router.post("/employee-refresh", async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(
        req.body.accessToken,
        config.auth.secret, { ignoreExpiration: true },
        async function(err, payload) {
            const { employeeId } = payload;
            const ret = await EmployeeModel.verifyRefreshToken(
                employeeId,
                req.body.refreshToken
            );
            if (ret === false) {
                throw createError(400, "Invalid refresh token.");
            }

            const accessToken = generateAccessToken(employeeId);
            res.json({ accessToken });
        }
    );
});

//admin refresh token
router.post("/admin-refresh", async(req, res) => {
    // req.body = {
    //   accessToken,
    //   refreshToken
    // }

    jwt.verify(
        req.body.accessToken,
        config.auth.secret, { ignoreExpiration: true },
        async function(err, payload) {
            const { adminId } = payload;
            const ret = await AdminModel.verifyRefreshToken(
                adminId,
                req.body.refreshToken
            );
            if (ret === false) {
                throw createError(400, "Invalid refresh token.");
            }

            const accessToken = generateAccessToken(adminId);
            res.json({ accessToken });
        }
    );
});

const generateAccessToken = (employeeId) => {
    const payload = { employeeId };
    const accessToken = jwt.sign(payload, config.token.secret, {
        expiresIn: config.token.expiresIn,
    });

    return accessToken;
};

module.exports = router;