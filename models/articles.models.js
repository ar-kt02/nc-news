const db = require("../db/connection");
const { checkArticleExists } = require("../utils");

exports.fetchArticles = () => {
   const sqlStr = `
   SELECT
   articles.author, 
   articles.title, 
   articles.article_id, 
   articles.topic, 
   articles.created_at, 
   articles.votes, 
   articles.article_img_url, 
   (SELECT COUNT(comment_id)::INT FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
   FROM 
   articles
   ORDER BY 
   articles.created_at DESC`;

   return db.query(sqlStr).then(({ rows }) => {
      return rows;
   });
};

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

exports.fetchArticleByIdComments = (article_id) => {
   return checkArticleExists(article_id)
      .then((result) => {
         if (!result) {
            return Promise.reject({ status: 404, msg: "Article not found" });
         }
      })
      .then(() => {
         const sqlStr = `
         SELECT * FROM comments 
         WHERE 
         article_id = $1 
         ORDER BY created_at DESC`;

         return db.query(sqlStr, [article_id]).then(({ rows }) => {
            return rows;
         });
      });
};
