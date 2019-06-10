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
  User.model.findById(req.params.id)
    .populate({
      path: 'friends'
    })
    .populate({
      path: 'worlds',
      populate: {
        path: 'games',
        path: 'users',
        path: 'admins'
      }
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err));
});

// TODO: Test when there are different and unrelated worlds, groups and friends
router.get('/:id/relationships', withAuth, (req, res) => {
  User.model.findById(req.params.id)
    .populate({
      path: 'friends'
    })
    .populate({
      path: 'worlds',
      populate: {
        path: 'users'
      }
    })
    .then(user => {
      let users = [];
      let usr = { ...user };

      if (!usr.friends) {
        usr.friends = [];
      }
      if (!usr.worlds) {
        usr.worlds = [];
      }

      usr.friends.forEach((friend) => {
        if (!users.includes(friend)) {
          users.push(friend);
        }
      });

      usr.worlds.forEach((world) => {
        world.users.forEach((worldUser) => {
          if (!users.includes(worldUser)) {
            users.push(worldUser);
          }
        });
      });

      return res.status(200).json(users);
    })
    .catch(err => res.status(500).send(err));
});

router.post('/', (req, res) => {
  let user = User.populate(req.body);
  user.save()
    .then(usr => res.status(200).json(usr))
    .catch(err => res.status(500).json(err));
});

// TODO: Change to PUT
router.post('/:id', (req, res) => {
  const { id } = req.params;

  User.model.update({ _id: id }, { ...req.body })
    .then((res) =>
      User.model.findById(id).populate({
        path: 'worlds',
        populate: { path: 'games' }
      })
    )
    .then((usr) => res.status(200).json(usr))
    .catch(err => res.status(500).json(err));
});

router.post('/:id/checkPassword', (req, res) => {
  const { password } = req.body;
  User.model.findById(req.params.id).populate({
    path: 'worlds',
    populate: { path: 'games' }
  }).then((user) => {
    user.isCorrectPassword(password)
      .then((same) => {
        if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect password'
            });
        } else {
          res.status(200).json(user);
        }
      })
      .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
