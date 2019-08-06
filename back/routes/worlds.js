const express = require('express');
const debug = require('debug')('route.worlds');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

const World = require('../db/models/World');
const User = require('../db/models/User');
const Game = require('../db/models/Game');

const UserController = require('../db/controllers/user.ctrl');
const WorldController = require('../db/controllers/world.ctrl');
const MatchController = require('../db/controllers/match.ctrl');

// WORLDS

router.get('/', withAuth, (req, res) => {
  WorldController.find(req.query)
    .then(worlds => res.status(200).json(worlds))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res, next) => {
  WorldController.findById(req.params.id)
    .then(world => res.status(200).json(world))
    .catch(err => {
      debug.extend('err')(new Error(err.message));
      next(err);
      // res.status(500).json(err)
    });
});

router.post('/', withAuth, (req, res) => {
  WorldController.create(req.body)
    .then(world => {
      return res.status(200).json(world);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
  WorldController.update(req.params.id, req.body)
    .then(world => {
      // TODO: Should this be async and send the response while updateing the users in background ?
      WorldController.updateUsers(world)
        .then(() => res.status(200).json(world))
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(500).json(err));
});


// USERS

router.get('/:world/users', withAuth, (req, res) => {
  UserController.findByWorld(req.params.world)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(err));
});

router.get('/:world/users/:id', withAuth, (req, res) => {
  const {
    id,
    world
  } = req.params;

  UserController.findByWorld(world, { _id: id })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).send(err));
});

router.put('/:id/users', withAuth, (req, res) => {
  WorldController.update(req.params.id, req.body)
    .then(world => {
      // TODO: Should this be async and send the response while updateing the users in background ?
      WorldController.updateUsers(world)
        .then(() => res.status(200).json(world))
        .catch(err => res.status(500).json(err))
    })
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
  MatchController.create({
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

router.put('/:world/games', withAuth, (req, res) => {
  WorldController.updateGames(req.params.world, req.body)
    .then(games => res.status(200).json(games))
    .catch(err => res.status(500).send(err));
});


router.get('/:world/games/:id/ranking', withAuth, (req, res) => {
  const {
    world,
    game
  } = req.params;

  // TODO: Create real Ranking find function
  UserController.findByWorld(world)
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
