const db = require("../db/connection");
const { checkUserExists } = require("../utils");

exports.fetchUsers = () => {
   const sqlStr = `SELECT * FROM users;`;
   return db.query(sqlStr).then(({ rows }) => {
      return rows;
   });
};

exports.fetchUserByUsername = (username) => {
   return checkUserExists(username)
      .then((result) => {
         if (!result) {
            return Promise.reject({ status: 404, msg: "User does not exist" });
         }
      })
      .then(() => {
         const sqlStr = `SELECT * FROM users WHERE username = $1`;

         return db.query(sqlStr, [username]).then(({ rows }) => {
            return rows[0];
         });
      });
};
