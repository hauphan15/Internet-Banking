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
    Delete: (entity) => {
        db.load(`UPDATE debtorlist SET status = 0 WHERE creatorID = ${entity.CreatorID} AND debtorID = ${entity.DebtorID} 
        AND content = '${entity.Content}' AND money = '${entity.Money}'`)
    },

    DebtList: userid => db.load(
        `SELECT * 
        FROM (SELECT * FROM debtorlist WHERE DeletedContent = 'no' AND Status = 'no') as list
        WHERE list.CreditorID = ${userid} OR list.DebtorID = ${userid}`)
};