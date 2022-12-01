const express = require('express');

const app = express();

app.use(express.static('./server/public'));

module.exports = app;