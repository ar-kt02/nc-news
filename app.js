const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const { serverErrors } = require("./error-handlers.js");

app.get("/api/topics", getTopics);

app.use(serverErrors);

module.exports = app;
