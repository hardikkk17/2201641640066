const express = require('express');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const shortenerRoutes = require('./routes/shortenerRoutes');

const app = express();
app.use(express.json());
app.use(logger); // custom logging middleware

app.use('/', shortenerRoutes);

app.use(errorHandler); // error handler
app.listen(3000);
