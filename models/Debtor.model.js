const db = require("../utils/db");
const bcrypt = require("bcryptjs");

module.exports = {
    getDebtor: (UserID) =>
        db.load(
            `SELECT * 
            FROM debtorlist 
            WHERE Status = 1 AND creatorID = ${UserID}`),

    getCreditor: (UserID) =>
        db.load(
            `SELECT * 
            FROM debtorlist 
            WHERE Status = 1 AND DebtorID = ${UserID}`),

    Add: (entity) => {
        // {
        //     CreatorID: ,
        //     DebtorID: ,
        //     Money: "",
        //     Content: "",
        //     Status: "1"
        // }
        return db.add("debtorlist", entity);
    },
};