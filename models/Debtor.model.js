const db = require("../utils/db");
const bcrypt = require("bcryptjs");

module.exports = {
    getDebtor: (UserID) =>
        db.load(
            `SELECT * FROM debtorlist WHERE DeletedContent = 'no' AND Status = 'no' AND CreditorID = ${UserID}`
        ),

    getCreditor: (UserID) =>
        db.load(`SELECT * FROM debtorlist WHERE DeletedContent = 'no' AND Status = 'no' AND DebtorID = ${UserID}`),

    Add: (entity) => {
        // {
        //     CreatorID: ,
        //     CreditorID: ,
        //     DebtorID: ,
        //     Money: "",
        //     Content: "",
        //     DeleteContent: "no",
        //     Status: "no"
        // }
        return db.add("debtorlist", entity);
    },

    DebtList: userid => db.load(
        `SELECT * 
        FROM (SELECT * FROM debtorlist WHERE DeletedContent = 'no' AND Status = 'no') as list
        WHERE list.CreditorID = ${userid} OR list.DebtorID = ${userid}`)
};