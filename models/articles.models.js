const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const { checkArticleExists } = require("../utils");

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
   const validSortBys = [
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
   ];
   const validOrders = ["asc", "desc"];

   if (
      !validSortBys.includes(sort_by) ||
      !validOrders.includes(order.toLowerCase())
   ) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
   }

   let sqlStr = `
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
   `;

   sqlStr += ` ORDER BY ${sort_by} ${order.toLowerCase()}`;

   return db.query(sqlStr).then(({ rows }) => {
      return rows;
   });
};

exports.fetchArticleById = (article_id = undefined) => {
   const sqlStr = `SELECT * FROM articles WHERE article_id = $1`;

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

exports.updateArticleById = (article_id, inc_votes) => {
   return checkArticleExists(article_id)
      .then((result) => {
         if (!result) {
            return Promise.reject({ status: 404, msg: "Article not found" });
         }
      })
      .then(() => {
         const sqlStr = `
         UPDATE articles 
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *`;

         return db.query(sqlStr, [inc_votes, article_id]).then(({ rows }) => {
            return rows[0];
         });
      });
};
