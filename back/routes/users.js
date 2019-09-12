const debug = require('debug')('users.routes');

const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

const UserController = require('../db/controllers/user.ctrl');
const User = require('../db/models/User');

const utils = require('../utils');

// TODO: Change routes to use UserController

router.get('/', withAuth, (req, res) => {
  User.model.find({}).populate({
    path: 'worlds',
    populate: { path: 'games' }
  }).then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(err));
});

router.get('/own', withAuth, (req, res) => {
  utils.decryptToken(req.headers.cookie.replace('token=', ''))
    .then(({ id }) => UserController.findById(id))
    .then(user => res.status(200).json(user))
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
      let usr = { ...user.toJSON() };
      let ids = [ usr.id ];

      if (!usr.friends) {
        usr.friends = [];
      } else if (!Array.isArray(usr.friends)) {
        usr.friends = [{ ...usr.friends }];
      }
      if (!usr.worlds) {
        usr.worlds = [];
      }

      usr.friends.forEach((friend) => {
        if (!ids.includes(friend.id)) {
          users.push(friend);
          ids.push(friend.id);
        }
      });

      usr.worlds.forEach((world, wIndex) => {
        world.users.forEach((worldUser, uIndex) => {
          if (!ids.includes(worldUser.id)) {
            users.push(worldUser);
            ids.push(worldUser.id);
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
router.put('/:id', (req, res) => {
  const { id } = req.params;

  User.model.updateOne({ _id: id }, { ...req.body })
    .then((res) => {
      return User.model.findById(id).populate({
        path: 'worlds',
        populate: { path: 'games' }
      });
    })
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
