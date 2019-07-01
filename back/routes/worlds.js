const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const WorldController = require('../../controllers/worlds.js');
const World = require('../db/models/World');
const User = require('../db/models/User');
const Game = require('../db/models/Game');
const MatchController = require('../db/controllers/match.ctrl');

router.get('/', withAuth, (req, res) => {
  World.model.find(req.query).exec()
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
  User.model.find({ worlds: req.params.world }).populate('world')
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

// TODO: DIFF if new user or just assigning a world. NOT WORKING NOW
router.post('/:world/users', (req, res) => {
  let user = User.populate({
    ...req.body,
    worlds: req.params.world
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


// GAMES

router.get('/:world/games', withAuth, (req, res) => {
  World.model.findById(req.params.world).populate('games')
    .then(world => res.status(200).json(world.games))
    .catch(err => res.status(500).send(err));
});

router.get('/:world/games/:id', withAuth, (req, res) => {
  const {
    world,
    id
  } = req.params;

  World.model.findById(world).populate('games')
    .then(world => {
      let game = world.games.find((item) => item.id === id);

      if (game) {
        return res.status(200).json(game);
      } else {
        throw new Error(`Game ${id} not found in World ${world}`);
      }
    })
    .catch(err => res.status(500).send(err));
});

// TODO: REDO FROM 0. NOT WORKING
router.post('/:world/games', withAuth, (req, res) => {
  /* let game = Game.populate({
    ...req.body,
    world: req.params.world
  });

  Game.model.save({
    ...req.body,
    world: req.params.world
  }).then(game => res.status(200).json(game))
    .catch(err => res.status(500).send(err)); */
});


router.get('/:world/games/:id/ranking', withAuth, (req, res) => {
  const {
    world,
    game
  } = req.params;

  // TODO: Create real Ranking find function
  User.model.find({ worlds: world }).populate('world')
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err));
});


// MATCHES BY GAME

router.get('/:world/games/:game/matches', withAuth, (req, res) => {
  MatchController.find({
    ...req.query,
    world: req.params.world,
    game: req.params.game
  }).then(matches => res.status(200).json(matches))
    .catch(err => res.status(500).send(err));
});

router.get('/:world/games/:game/matches/:id', withAuth, (req, res) => {
  const {
    id,
    world,
    game
  } = req.params;

  MatchController.findById({ id, world, game })
    .then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});

router.post('/:world/games/:game/matches', withAuth, (req, res) => {
  MatchController.save({
    ...req.body,
    world: req.params.world,
    game: req.params.game
  }).then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});


module.exports = router;
