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
            message: 'Số tài khoản không hợp lệ'
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
    const object = {
        ID: retAdd.insertId,
        Number: req.body.Number,
        Name: takerName[0].Name
    };
    res.status(201).json({
        success: true,
        object
    });
})


//xóa người nhận
router.post('/delete', async(req, res) => {
    // req.body = {
    //     "ID": "",
    // }

    const ret = await TakerListModel.delete(req.body.ID);

    res.send({
        ret,
        success: true
    });
})

//update stk và tên gợi nhớ người nhận
router.post('/update', async(req, res) => {
    // req.body = {
    //     "ID": ""
    //     "Name": ""
    // }

    const info = await TakerListModel.singleById(req.body.ID);
    if (info.length === 0) {
        return res.send({
            success: false
        })
    }

    const entity = {
        Number: info[0].Number,
        Name: req.body.Name
    };

    const retUpdate = await TakerListModel.update(req.body.ID, entity);

    if (retUpdate.changedRows === 1) {
        res.send({
            success: true,
            message: 'Cập nhật thành công'
        });
    } else {
        res.send({
            success: false,
            message: 'Cập nhật thất bại'
        });
    }
})

module.exports = router;