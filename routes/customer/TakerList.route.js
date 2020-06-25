const express = require('express');
const TakerListModel = require('../../models/TakerList.model');
const UserAccModel = require('../../models/UserAccount.model');


const router = express.Router();

router.post('/', async(req, res) => {
    // req.body = {
    //     "UserID": ""
    // }

    const result = await TakerListModel.singleByUserId(req.body.UserID);

    for (let index = 0; index < result.length; index++) {
        delete result[index].UserID;
    }

    res.send(result);
})


//thêm người nhận
router.post('/add', async(req, res) => {
    // req.body = {
    //     "UserID": "",
    //     "Number": "",
    //     "Name": ""
    // };
    const info = await UserAccModel.singleByNumber(req.body.Number);

    //kiểm tra tài khoản người nhận có hợp lệ
    if (info.length === 0) {
        return res.send({
            success: false,
            message: 'Invalid TakerNumber'
        })
    }

    //nếu ko nhập tên gợi nhớ, dùng tên đăng ký
    let name = req.body.Name;
    if (name === '') {
        name = info[0].FullName;
    }

    const taker = {
        UserID: req.body.UserID,
        Number: req.body.Number,
        Name: name
    }

    const retAdd = await TakerListModel.add(taker);
    const takerName = await TakerListModel.singleById(retAdd.insertId);
    res.status(201).json({
        ID: retAdd.insertId,
        UserID: req.body.UserID,
        Number: req.body.Number,
        Name: takerName[0].Name
    });
})


//xóa người nhân
router.post('/delete', async(req, res) => {
    // req.body = {
    //     "ID": "",
    // }

    const ret = await TakerListModel.delete(req.body.ID);

    res.send(ret);
})

//update stk và tên gợi nhớ người nhận
router.post('/update', async(req, res) => {
    // req.body = {
    //     "ID": ""
    //     "Number": "",
    //     "Name": ""
    // }

    const info = await TakerListModel.singleById(req.body.ID);

    let number = req.body.Number;
    let name = req.body.Name;

    //nếu ko update number
    if (number === '') {
        number = info[0].Number;
    }
    //nếu không update name
    if (name === '') {
        name = info[0].Name;
    }

    const entity = {
        Number: number,
        Name: name
    };

    const retUpdate = await TakerListModel.update(req.body.ID, entity);

    let result;
    if (retUpdate.changedRows === 1) {
        result = {
            success: true,
            message: 'successful Update'
        }
    } else {
        result = {
            success: false,
            message: 'Failed Update'
        }
    }

    res.send(result);
})

module.exports = router;