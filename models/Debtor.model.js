const db = require("../utils/db");
const bcrypt = require("bcryptjs");

module.exports = {
  getDebtor: (UserID) =>
    db.load(
      `Select * From debtorlist Where DeletedContent = 'no' and Status = 'no' and CreditorID = ${UserID}`
    ),
  getCreditor: (UserID) =>
    db.load(`Select * From debtorlist Where DeletedContent = 'no' and Status = 'no' and DebtorID = ${UserID}`),
  Add: (entity) => {
    // {
    //     CreditorID: ,
    //     DebtorID: ,
    //     Money: "",
    //     Content: "",
    //     DeleteContent: "",
    //     Status: ""
    // }
    return db.add("debtorlist", entity);
  },
};
