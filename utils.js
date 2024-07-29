const db = require("./db/connection");

exports.checkArticleExists = (article_id) => {
   const sqlStr = "SELECT * FROM articles WHERE article_id = $1";

   return db.query(sqlStr, [article_id]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};

exports.checkUserExists = (username) => {
   const sqlStr = "SELECT * FROM users WHERE username = $1";

   return db.query(sqlStr, [username]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};

exports.checkCommentExists = (comment_id) => {
   const sqlStr = "SELECT * FROM comments WHERE comment_id = $1";

   return db.query(sqlStr, [comment_id]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};

exports.checkTopicExists = (slug) => {
   const sqlStr = "SELECT * FROM topics WHERE slug = $1";

   return db.query(sqlStr, [slug]).then(({ rows }) => {
      return rows.length > 0 ? true : false;
   });
};

exports.countTotalArticles = (topic) => {
   let sqlStr = `SELECT COUNT(*)::INT as total_count FROM articles`;
   let queryValues = [];

   if (topic) {
      sqlStr += ` WHERE topic = $1`;
      queryValues.push(topic);
   }

   return db.query(sqlStr, queryValues).then(({ rows }) => {
      return rows[0].total_count;
   });
};
