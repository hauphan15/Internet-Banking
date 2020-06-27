const db = require("../utils/db");

module.exports = {
    getDebtor: (UserID) =>
        db.load(
            `SELECT * FROM debtorlist WHERE status = 1 AND creatorID = ${UserID}`
        ),

    getCreditor: (UserID) =>
        db.load(`SELECT * FROM debtorlist WHERE status = 1 AND debtorID = ${UserID}`),

    Add: (entity) => {
        // {
        //     CreatorID: ,
        //     DebtorID: ,
        //     Money: "",
        //     Content: "",
        //     Status: "no"
        // }
        return db.add("debtorlist", entity);
    },

    DebtList: userid => db.load(
        `SELECT * 
        FROM (SELECT * FROM debtorlist WHERE DeletedContent = 'no' AND Status = 'no') as list
        WHERE list.CreditorID = ${userid} OR list.DebtorID = ${userid}`)
};