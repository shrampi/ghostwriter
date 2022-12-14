const express = require('express');
const cors = require('cors');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorMiddleware = require('./middleware/errorMiddleware');
const requestLogger = require('./middleware/requestLogger');
const bookRouter = require('./controllers/books');
const searchRouter = require('./controllers/search');
const sourcesRouter = require('./controllers/sources');

const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.static('./server/public'));

app.use(bookRouter);
app.use(searchRouter);
app.use(sourcesRouter);

app.use(unknownEndpoint);
app.use(errorMiddleware);

module.exports = app;