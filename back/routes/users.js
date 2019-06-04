const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const UserController = require('../../controllers/users.js');
const User = require('../db/models/User');

router.get('/', withAuth, (req, res) => {
  User.model.find({}).populate({
    path: 'worlds',
    populate: { path: 'games' }
  }).then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  User.model.findById(req.params.id).populate({
    path: 'worlds',
    populate: { path: 'games' }
  }).then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
  let user = User.populate(req.body);
  user.save()
    .then(usr => res.status(200).json(usr))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
