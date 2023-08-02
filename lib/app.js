require("express-async-errors");
const express = require("express");
const app = express();

// register hook containers
global.containers = {};

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use("/api", require("./endpoints/routes"));

module.exports = app;
