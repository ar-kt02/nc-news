const {
   fetchArticles,
   fetchArticleById,
   fetchArticleByIdComments,
} = require("../models/articles.models.js");

exports.getArticles = (request, response, next) => {
   fetchArticles()
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
