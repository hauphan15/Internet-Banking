const express = require('express');
const EmployeeModel = require('../../models/Employee.model');

const router = express.Router();

//lấy tất cả nhân viên
router.get('/', async(req, res) => {
    const result = await EmployeeModel.all();

    if (result.length === 0) {
        return res.send({
            message: 'Empty'
        })
    }

    res.send(result);
})


//thêm nhân viên
router.post('/add', async(req, res) => {
    // entity = {
    //     "UserName": "",
    //     "Password": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": "",
    //     "DoB": "",
    // }

    const retAdd = await EmployeeModel.add(req.body);

    res.status(201).json({
        ID: retAdd.insertId,
    });
})


//xóa nhân viên
router.post('/delete', async(req, res) => {
    // req.body = {
    //     "ID": "",
    // }

    const ret = await EmployeeModel.delete(req.body.ID);

    res.send(ret);
})

//update info nhân viên
router.post('/update', async(req, res) => {
    // entity = {
    //     "UserName": "",
    //     "FullName": "",
    //     "Email": "",
    //     "Phone": "",
    //     "DoB": "",
    // }

    const info = await EmployeeModel.singleById(req.body.ID);

    let UserName = req.body.UserName;
    let Email = req.body.Email;
    let Phone = req.body.Phone;
    let DoB = req.body.DoB;
    let FullName = req.body.FullName;

    //nếu ko update UserName
    if (UserName === '') {
        UserName = info[0].UserName;
    }
    //nếu không update FullName
    if (Email === '') {
        Email = info[0].Email;
    }
    //nếu không update FullName
    if (Phone === '') {
        Phone = info[0].Phone;
    }
    //nếu không update FullName
    if (DoB === '') {
        DoB = info[0].DoB;
    }
    //nếu không update FullName
    if (FullName === '') {
        FullName = info[0].FullName;
    }

    const entity = {
        UserName: UserName,
        FullName: FullName,
        Email: Email,
        Phone: Phone,
        DoB: DoB
    };

    const retUpdate = await EmployeeModel.update(req.body.ID, entity);

    let result;
    if (retUpdate.changedRows === 1) {
        result = {
            success: true,
            message: 'Successful update'
        }
    } else {
        result = {
            success: false,
            message: 'Failed update'
        }
    }

    res.send(result);
})


module.exports = router;