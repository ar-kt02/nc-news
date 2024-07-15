const db = require("../db/connection");

exports.fetchArticleById = (article_id = undefined) => {
   let sqlStr = `SELECT * FROM articles WHERE article_id = $1`;

   return db.query(sqlStr, [article_id]).then(({ rows }) => {
      if (rows.length === 0) {
         return Promise.reject({
            status: 404,
            msg: "Article not found",
         });
      }
      return rows[0];
   });
};
