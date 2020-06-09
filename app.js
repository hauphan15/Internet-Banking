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
})

//api infor
app.use('/user-account', verifyPartner.partnerCode, verifyPartner.partnerTime, verifyPartner.partnerSig, require('./routes/customer/UserAccount.route'));

//api add money
app.use('/account-number', verifyPartner.partnerCode, verifyPartner.partnerTime, verifyPartner.partnerSig, verifyPartner.partnerAsymmetricSig, require('./routes/customer/AccountNumber.route'));

//login and ...
app.use('/user', require('./routes/customer/UserAccount.route'));

//register and ...
app.use('/employee', require('./routes/employee/CreateCustomerAcc.route'));

//get all user
app.use('/user-all', verifyToken, require('./routes/customer/UserAccount.route'));

//transaction
app.use('/customer', require('./routes/customer/Transaction.route'));


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