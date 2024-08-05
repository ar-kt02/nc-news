const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

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
