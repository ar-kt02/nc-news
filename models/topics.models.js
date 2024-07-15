const db = require("../db/connection");

exports.fetchTopics = () => {
   const sqlStr = `SELECT * FROM topics;`;

   return db.query(sqlStr).then(({ rows }) => {
      return rows;
   });
};
