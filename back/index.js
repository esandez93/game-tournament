const express = require('express');
const logger = require('@game-tournament/logger');
require('./db')

const PORT = process.env.PORT || 3020;
const app = express();

const modules = [
  './middleware',
  './routes',
  './server',

  // The error handler is always the last
  './error-handler'
]

modules.forEach((mod) => {
  require(mod)(app);
});
