const express = require('express');

const pingRouter = require('./routes/ping');
const postRouter = require('./routes/posts');

const app = express();

app.use(express.json());
app.use(pingRouter);
app.use(postRouter);

module.exports = app;