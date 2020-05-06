const express = require('express');

const verify = require('./middlewares/partner.mdw');

require('express-async-errors');

///
const app = express();

app.get('/', function(req, res) {
    res.send('Hello from Mrhauphan !!');
})

app.use('/user-account', verify, require('./routes/UserAccount.route'));

app.use((req, res, next) => {
    res.status(404).send('NOT FOUND');
})

app.use(function(err, req, res, next) {
    console.log(err.stack);
    const statusCode = err.status || 500;
    res.status(statusCode).send('View error log on console.');
})

app.listen(3000, () => {
    console.log('API is running at http://localhost:3000');
})