const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const { getEndpoints } = require("./controllers/endpoints.controllers.js");
const {
   getArticles,
   getArticleById,
   getArticleByIdComments,
   patchArticleById,
} = require("./controllers/articles.controllers.js");
const {
   postComment,
   deleteCommentById,
} = require("./controllers/comments.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
   sqlErrors,
   serverErrors,
   customErrors,
} = require("./error-handlers.js");

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getArticleByIdComments);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(sqlErrors);

app.use(customErrors);

app.use(serverErrors);

module.exports = app;
