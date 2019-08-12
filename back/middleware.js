const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const express = require('express');
const path = require('path');

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://app.localhost.com:3000',
  'https://game-tournament.netlify.com'
]

module.exports = (app) => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, 'public')));

  // app.use(cors({credentials: true, origin: true}));

  app.use((req, res, next) => {
    if (ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS');
    } else { // allow other origins to make unauthenticated CORS requests
      res.header('Access-Control-Allow-Origin', '*');
    }

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
  });
};
