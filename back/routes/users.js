// Import dependencies
const express = require('express');
const router = express.Router();

// const UserController = require('../../controllers/users.js');
const User = require('../db/models/User')

router.get('/', (req, res, next) => {
  User.model.find({}).populate('company')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(error));
});

router.get('/:id', (req, res, next) => {
  User.model.findById(req.params.id).populate('company')
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(error));
});

router.post('/', (req, res, next) => {
  let user = User.populate(req.body);
  user.save()
    .then(usr => res.status(200).json(usr))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
