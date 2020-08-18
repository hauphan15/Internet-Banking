const express = require('express');
const EmployeeModel = require('../../models/Employee.Model');
const moment = require('moment');


const router = express.Router();


router.get("/", (req, res) => {
    res.json("hello");
})


//lấy tất cả nhân viên
router.get('/employee-list', async(req, res) => {
    const result = await EmployeeModel.all();

    for (let index = 0; index < result.length; index++) {
        delete result[index].UserPassword;
    }

    res.send(result);
})


//thêm nhân viên
router.post('/add-employee', async(req, res) => {
    // entity = {
    //     "UserName": "",
    //     "UserPassword": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": "",
    //     "DoB": "",
    // }

    //kiểm tra username
    const usrname = await EmployeeModel.singleByUserName(req.body.UserName);
    if (usrname.length > 0) {
        return res.send({
            success: false,
            message: 'Tên đăng nhập đã được sử dụng'
        })
    }

    const retAdd = await EmployeeModel.add(req.body);

    res.status(201).json({
        success: true,
        ID: retAdd.insertId,
    });
})


//xóa nhân viên
router.post('/delete-employee', async(req, res) => {
    // req.body = {
    //     "ID": "",
    // }

    const ret = await EmployeeModel.delete(req.body.ID);

    res.send({
        success: true,
        ret
    });
})

//update info nhân viên
router.post('/update-employee', async(req, res) => {
    // entity = {
    //     "ID": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": "",
    //     "DoB": "",
    // }

    const entity = {
        FullName: req.body.FullName,
        Email: req.body.Email,
        Phone: req.body.Phone,
        DoB: req.body.DoB
    };

    const retUpdate = await EmployeeModel.updateInfo(req.body.ID, entity);

    if (retUpdate.changedRows === 1) {
        return res.send({
            success: true,
            message: 'Cập nhật thành công'
        })
    } else {
        return res.send({
            success: false,
            message: 'Cập nhật thất bại'
        })
    }

})


module.exports = router;