const db = require("../db/connection");

exports.fetchUsers = () => {
   const sqlStr = `SELECT * FROM users;`;
   return db.query(sqlStr).then(({ rows }) => {
      return rows;
   });
};
