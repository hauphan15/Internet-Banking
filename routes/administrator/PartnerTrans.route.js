const express = require('express');
const PartnerTransModel = require('../../models/PartnerTransaction.model');

const router = express.Router();

//lấy tất cả giao dịch với ngân hàng đối tác
router.get('/partner/all', async(req, res) => {
    const result = await PartnerTransModel.all();
    if (result.length === 0) {
        return res.send({
            message: 'Empty'
        })
    }

    res.send(result);
})


//xem theo ngân hàng đối tác chỉ định
router.post('/partner/by-name', async(req, res) => {
    // req.body = {
    //     PartnerBank: ""
    // }

    const result = await PartnerTransModel.byPartnerBank(req.body.PartnerBank);


    res.send(result);
})


//thống kê tổng tiền đã giao dịch với ngân hàng chỉ định
router.post('/partner/statistic-money', async(req, res) => {
    // req.body = {
    //     PartnerBank: ""
    // }
    let sum = 0;
    const result = await PartnerTransModel.byPartnerBank(req.body.PartnerBank);
    result.forEach(element => {
        sum += (+element.Money)
    });
    res.json(sum);
})



//xem theo khoảng thời gian
router.post('/partner/by-time', async(req, res) => {
    // req.body = {
    //     from: "",
    //     to: ""
    // }
    const time = {
        from: req.body.from,
        to: req.body.to
    };

    const result = await PartnerTransModel.byDate(time);
    if (result.length === 0) {
        return res.send({
            message: 'Empty'
        })
    }

    res.send(result);
})
module.exports = router;