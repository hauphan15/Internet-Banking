const express = require('express');
const EmployeeModel = require('../../models/Employee.Model');

const router = express.Router();

//lấy tất cả nhân viên
router.get('/employee-list', async(req, res) => {
    const result = await EmployeeModel.all();

    delete result[0].UserPassword;
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
    console.log(req.body);
    const retAdd = await EmployeeModel.add(req.body);

    res.status(201).json({
        ID: retAdd.insertId,
    });
})


//xóa nhân viên
router.post('/delete-employee', async(req, res) => {
    // req.body = {
    //     "ID": "",
    // }

    const ret = await EmployeeModel.delete(req.body.ID);

    res.send(ret);
})

//update info nhân viên
router.post('/update-employee', async(req, res) => {
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
    //nếu không update Email
    if (Email === '') {
        Email = info[0].Email;
    }
    //nếu không update Phone
    if (Phone === '') {
        Phone = info[0].Phone;
    }
    //nếu không update DoB
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

    const retUpdate = await EmployeeModel.updateInfo(req.body.ID, entity);

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