// Import dependencies
const express = require('express');
const moment = require('moment');
const debug = require('debug')('games.routes');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const CharacterController = require('../../controllers/characters.js');
const Game = require('../db/models/Game');
const Character = require('../db/models/Character');

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
  } = req.params;

  Character.model.find({ id, game }).exec()
    .then(character => res.status(200).json(character))
    .catch(err => res.status(500).send(err));
});

router.post('/:game/characters', withAuth, (req, res) => {
  let character = Character.populate({
    ...req.body,
    game: req.params.game
  });
  let char = null;

  character.creationDate = moment().utc();
  character.lastUpdate = character.creationDate;

  character.save()
    .then(newChar => {
      char = newChar;

      return Game.model.findById(req.params.game);
    })
    .then((game) => {
      game.updateOne({
        characters: game.characters ? [ ...game.characters, char.id ] : [ char.id ],
        lastUpdate: moment().utc()
      }).then((response) => {
      }).catch((error) => {
        console.error(error);
      });

      return res.status(200).json(char);
    })
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
    character.creationDate = moment().utc();
    character.lastUpdate = character.creationDate;

    characters.push(character);

    character.save()
      .then(characters.push)
      .catch(err => error = err);
  });

  Game.model.findById(req.params.game)
  .then((game) => {
    let ids = [];
    characters.forEach((character) => ids.push(character.id));

    game.updateOne({
      characters: game.characters ? [ ...game.characters, ...ids ] : [ ...ids ],
      lastUpdate: moment().utc()
    }).then((response) => {
    }).catch((error) => {
      console.error(error);
    });
  })
  .then((error) => res.status(500).json(error));

  if (error) {
    res.status(500).json(error);
  } else {
    res.status(200).json(characters);
  }
});

module.exports = router;
