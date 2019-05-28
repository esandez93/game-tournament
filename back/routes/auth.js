const express = require('express');
const jwt = require('jsonwebtoken');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

const User = require('../db/models/User');

router.get('/checkToken', withAuth, (req, res) => res.status(200).json({}));

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.model.findOne({ username })
    .then((user) => {
      if (!user) {
        res.status(401)
          .json({
            error: 'Incorrect username or password'
          });
      } else {
        user.isCorrectPassword(password)
          .then((same) => {
            if (!same) {
              res.status(401)
                .json({
                  error: 'Incorrect username or password'
                });
            } else {
              // Issue token
              const token = jwt.sign({ username }, process.env.AUTH_SECRET, {
                expiresIn: '1h'
              });
              const options = {
                httpOnly: true
              };
              res.cookie('token', token, options).status(200).json(user);
            }
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

router.get('/logout', (req, res) => {
  const options = {
    httpOnly: true,
    expires: new Date(),
    overwrite: true,
  };

  res.cookie('token', '', options).status(200).json({});
});

module.exports = router;
