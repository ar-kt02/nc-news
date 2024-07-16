const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const { getEndpoints } = require("./controllers/endpoints.controllers.js");
const {
   getArticles,
   getArticleById,
} = require("./controllers/articles.controllers.js");
const {
   sqlErrors,
   serverErrors,
   customErrors,
} = require("./error-handlers.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use(sqlErrors);

app.use(customErrors);

app.use(serverErrors);

module.exports = app;
