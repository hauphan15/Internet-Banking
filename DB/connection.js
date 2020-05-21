const mongoose = require('mongoose');

const Url = "mongodb+srv://hhbank:hhbank@hh-internetbanking-zq9ya.mongodb.net/test?retryWrites=true&w=majority";

const ConnectDB = async()=>{
    await mongoose.connect(Url,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = ConnectDB;