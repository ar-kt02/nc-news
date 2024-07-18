const { response } = require("../app.js");
const {
   fetchArticles,
   fetchArticleById,
   fetchArticleByIdComments,
   updateArticleById,
} = require("../models/articles.models.js");

exports.getArticles = (request, response, next) => {
   const { sort_by, order, topic } = request.query;

   fetchArticles(sort_by, order, topic)
      .then((articles) => {
         response.status(200).send({ articles });
      })
      .catch(next);
};

exports.getArticleById = (request, response, next) => {
   const { article_id } = request.params;
   fetchArticleById(article_id)
      .then((article) => {
         response.status(200).send({ article });
      })
      .catch(next);
};

exports.getArticleByIdComments = (request, response, next) => {
   const { article_id } = request.params;

   fetchArticleByIdComments(article_id)
      .then((comments) => {
         response.status(200).send({ comments });
      })
      .catch(next);
};

exports.patchArticleById = (request, response, next) => {
   const { article_id } = request.params;
   const { inc_votes } = request.body;

   updateArticleById(article_id, inc_votes)
      .then((article) => {
         response.status(200).send({ article });
      })
      .catch(next);
};
