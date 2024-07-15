const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const { getEndpoints } = require("./controllers/endpoints.controllers.js");
const { serverErrors } = require("./error-handlers.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use(serverErrors);

module.exports = app;
