app.use(cors());

const express = require("express");
const app = express();
const cors = require("cors");

const apiRouter = require("./routes/api-router");
const {
   sqlErrors,
   serverErrors,
   customErrors,
} = require("./error-handlers.js");

app.use(express.json());

app.use("/api", apiRouter);

app.use(sqlErrors);
app.use(customErrors);
app.use(serverErrors);

module.exports = app;
