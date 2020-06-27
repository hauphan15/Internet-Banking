const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const verifyPartner = require('./middlewares/partner.mdw');
const verifyToken = require('./middlewares/verifyToken.mdw');

require('express-async-errors');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.send('Hello from Mrhauphan !!');
});

//-------------------PARTNER-------------------------
//api cho partner goi infor
app.use('/user-account', verifyPartner.partnerCode, verifyPartner.partnerTime, verifyPartner.partnerSig, require('./routes/customer/UserAccount.route'));

//api cho partner chuyen tien 
app.use('/account-number', verifyPartner.partnerCode, verifyPartner.partnerTime, verifyPartner.partnerSig, verifyPartner.partnerAsymmetricSig, require('./routes/customer/AccountNumber.route'));

//goi api ngân hàng pgp
app.use('/partner-pgp', verifyToken, require('./routes/partner/PGPBank.route'));

//goi api ngân hàng rsa
app.use('/partner-rsa', verifyToken, require('./routes/partner/RSABank.route'));


//--------------------LOGIN------------------------
//login and refresh token
app.use('/login', require('./routes/login/Login.route'));


//--------------------CHANGE PASSWORD------------------------
//change password
app.use('/misspw', verifyToken, require('./routes/login/ForgetPassword.route'));


//-----------------------EMPLOYEE------------------------
//employee create acc
app.use('/employee', verifyToken, require('./routes/employee/CreateCustomerAcc.route'));

//employee transaction
app.use('/employee', verifyToken, require('./routes/employee/CustomerTrans.route'));


//---------------------CUSTOMER--------------------------
//customer account | transaction history
app.use('/customer', require('./routes/customer/UserAccount.route'));

//takerlist
app.use('/customer/takerlist', require('./routes/customer/TakerList.route'));

//transaction
app.use('/customer', require('./routes/customer/Transaction.route'));

//nhắc nợ
app.use('/customer/reminddebt', require('./routes/customer/RemindDebt.route'));


//---------------------ADMIN--------------------------
//giao dịch với ngân hàng đối tác
app.use('/admin', verifyToken, require('./routes/administrator/PartnerTrans.route'));

//quản lý nhân viên
app.use('/admin', verifyToken, require('./routes/administrator/ManageEmployee.route'));

//tạo tk admin
app.use('/admin', verifyToken, require('./routes/administrator/Admin.route'));



app.use((req, res, next) => {
    res.status(404).send('NOT FOUND');
})

app.use(function(err, req, res, next) {
    console.log(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).send('View error log on console.');
})

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
})