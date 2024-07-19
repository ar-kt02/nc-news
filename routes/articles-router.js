const articlesRouter = require("express").Router();
const {
   getArticles,
   getArticleById,
   getArticleByIdComments,
   patchArticleById,
} = require("../controllers/articles.controllers");
const { postComment } = require("../controllers/comments.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
   .route("/:article_id")
   .get(getArticleById)
   .patch(patchArticleById);

articlesRouter
   .route("/:article_id/comments")
   .get(getArticleByIdComments)
   .post(postComment);

module.exports = articlesRouter;
