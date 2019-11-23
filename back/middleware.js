const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const express = require('express');
const path = require('path');

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://app.localhost.com:3000',
  'https://game-tournament.netlify.com'
]

const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
const errorLogStream = rfs('error.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});

module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, 'public')));

  // logs all access
  app.use(morgan('combined', { stream: accessLogStream }));

  // logs errors separately
  app.use(morgan('dev', {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400
  }));

  // app.use(cors({credentials: true, origin: true}));

  app.use((req, res, next) => {
    if (ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
    } else { // allow other origins to make unauthenticated CORS requests
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });
};
