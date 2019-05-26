// Import dependencies
const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const CharacterController = require('../../controllers/characters.js');
const Character = require('../db/models/Character')

router.get('/', withAuth, (req, res) => {
  Character.model.find({}).exec()
    .then(characters => res.status(200).json(characters))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  Character.model.findById(req.params.id).exec()
    .then(character => res.status(200).json(character))
    .catch(err => res.status(500).send(err));
});

router.post('/', withAuth, (req, res) => {
  let character = Character.populate(req.body);
  character.save()
    .then(char => res.status(200).json(char))
    .catch(err => res.status(500).json(err));
});

router.post('/batch', withAuth, (req, res) => {
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
