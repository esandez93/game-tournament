// Import dependencies
const express = require('express');
const router = express.Router();

// const CharacterController = require('../../controllers/characters.js');
const Character = require('../db/models/Character')

router.get('/', (req, res, next) => {
  Character.model.find({}).exec()
    .then(characters => res.status(200).json(characters))
    .catch(err => res.status(500).send(error));
});

router.get('/:id', (req, res, next) => {
  Character.model.findById(req.params.id).exec()
    .then(character => res.status(200).json(character))
    .catch(err => res.status(500).send(error));
});

router.post('/', (req, res, next) => {
  let character = Character.populate(req.body);
  character.save()
    .then(char => res.status(200).json(char))
    .catch(err => res.status(500).json(err));
});

router.post('/batch', (req, res, next) => {
  let characters = [];
  req.body.forEach(char => {
    let character = Character.populate(char);
    character.save()
      .then(characters.push)
      .catch(err => res.status(500).json(err));
  });

  return res.status(200).json(characters);
});

module.exports = router;
