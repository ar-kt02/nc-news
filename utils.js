const db = require("./db/connection");

exports.checkArticleExists = (article_id) => {
   sqlStr = "SELECT * FROM articles WHERE article_id = $1";

   return db.query(sqlStr, [article_id]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};

exports.checkUserExists = (username) => {
   sqlStr = "SELECT * FROM users WHERE username = $1";

   return db.query(sqlStr, [username]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};
