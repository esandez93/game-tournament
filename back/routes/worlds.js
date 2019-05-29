const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const WorldController = require('../../controllers/worlds.js');
const World = require('../db/models/World');
const User = require('../db/models/User');
const Match = require('../db/models/Match');
const MatchController = require('../db/controllers/match.ctrl');

router.get('/', withAuth, (req, res) => {
  World.model.find({}).exec()
    .then(worlds => res.status(200).json(worlds))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  World.model.findById(req.params.id).exec()
    .then(world => res.status(200).json(world))
    .catch(err => res.status(500).send(err));
});

router.post('/', withAuth, (req, res) => {
  let world = World.populate(req.body);
  world.save()
    .then(comp => res.status(200).json(comp))
    .catch(err => res.status(500).json(err));
});


// USERS

router.get('/:world/users', withAuth, (req, res) => {
  User.model.find({ world: req.params.world }).populate('world')
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(err));
});

router.get('/:world/users/:id', withAuth, (req, res) => {
  const {
    id,
    world
  } = req.params;

  User.model.find({ id, world }).populate('world')
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err));
});

router.post('/:world/users', (req, res) => {
  let user = User.populate({
    ...req.body,
    world: req.params.world
  });

  user.save()
    .then(usr => res.status(200).json(usr))
    .catch(err => res.status(500).json(err));
});


// MATCHES

router.get('/:world/matches', withAuth, (req, res) => {
  MatchController.find({
    ...req.query,
    world: req.params.world
  }).then(matches => res.status(200).json(matches))
    .catch(err => res.status(500).send(err));
});

router.get('/:world/matches/:id', withAuth, (req, res) => {
  const {
    id,
    world
  } = req.params;

  MatchController.findById({ id, world })
    .then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});

router.post('/:world/matches', withAuth, (req, res) => {
  MatchController.save({
    ...req.body,
    world: req.params.world
  }).then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});


module.exports = router;
