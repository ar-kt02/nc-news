const articlesRouter = require("express").Router();
const {
   getArticles,
   getArticleById,
   getArticleByIdComments,
   patchArticleById,
   postArticle,
} = require("../controllers/articles.controllers");
const { postComment } = require("../controllers/comments.controllers");

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
   .route("/:article_id")
   .get(getArticleById)
   .patch(patchArticleById);

articlesRouter
   .route("/:article_id/comments")
   .get(getArticleByIdComments)
   .post(postComment);

module.exports = articlesRouter;
