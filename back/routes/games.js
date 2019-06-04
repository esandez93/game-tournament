// Import dependencies
const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const CharacterController = require('../../controllers/characters.js');
const Game = require('../db/models/Game')
const Character = require('../db/models/Character')

router.get('/', withAuth, (req, res) => {
  Game.model.find().exec()
    .then(games => res.status(200).json(games))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  Game.model.findById(req.params.id).exec()
    .then(game => res.status(200).json(game))
    .catch(err => res.status(500).send(err));
});

router.post('/', withAuth, (req, res) => {
  let game = Game.populate(req.body);
  game.save()
    .then(gm => res.status(200).json(gm))
    .catch(err => res.status(500).json(err));
});

// CHARACTERS

router.get('/:game/characters', withAuth, (req, res) => {
  Character.model.find({ game: req.params.game }).exec()
    .then(characters => res.status(200).json(characters))
    .catch(err => res.status(500).send(err));
});

router.get('/:game/characters/:id', withAuth, (req, res) => {
  const {
    id,
    game
  } = props;

  Character.model.findById({ id, game }).exec()
    .then(character => res.status(200).json(character))
    .catch(err => res.status(500).send(err));
});

router.post('/:game/characters', withAuth, (req, res) => {
  let character = Character.populate(req.body);
  character.save()
    .then(char => res.status(200).json(char))
    .catch(err => res.status(500).json(err));
});

router.post('/:game/characters/batch', withAuth, (req, res) => {
  let characters = [];

  let error;
  req.body.forEach(char => {
    const character = Character.populate({
      ...char,
      game: req.params.game
    });

    character.save()
      .then(characters.push)
      .catch(err => error = err);
  });

  if (error) {
    res.status(500).json(error)
  } else {
    res.status(200).json(characters);
  }
});

module.exports = router;
