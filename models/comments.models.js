const db = require("../db/connection");
const { checkArticleExists, checkUserExists } = require("../utils");

exports.insertComment = (article_id, username, body) => {
   if (!username || !body) {
      return Promise.reject({ status: 400, msg: "Missing fields" });
   }

   return checkArticleExists(article_id)
      .then((result) => {
         if (!result) {
            return Promise.reject({ status: 404, msg: "Article not found" });
         }
      })
      .then(() => {
         return checkUserExists(username).then((result) => {
            if (!result) {
               return Promise.reject({
                  status: 404,
                  msg: "Username does not exist",
               });
            }
         });
      })
      .then(() => {
         const sqlStr = `
         INSERT INTO comments (
         article_id,
         author,
         body
         ) VALUES ($1, $2, $3) RETURNING *;`;

         return db.query(sqlStr, [article_id, username, body]);
      })
      .then(({ rows }) => {
         return rows[0];
      });
};
