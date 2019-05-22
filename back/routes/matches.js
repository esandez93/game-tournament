// Import dependencies
const express = require('express');
const router = express.Router();

// const MatchController = require('../../controllers/matchess.js');
const Match = require('../db/models/Match')

const populatePlayer = (num) => ({
  path: `player${num}.user`,
  populate: { path: 'company' }
});

router.get('/', (req, res, next) => {
  Match.model.find()
    .populate(populatePlayer(1))
    .populate(populatePlayer(2))
    .then(matches => res.status(200).json(matches))
    .catch(err => res.status(500).send(error));
});

router.get('/:id', (req, res, next) => {
  Match.model.findById(req.params.id)
    .populate(populatePlayer(1))
    .populate(populatePlayer(2))
    .then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(error));
});

router.post('/', (req, res, next) => {
  let match = Match.populate(req.body);
  match.save()
    .then(newMatch => res.status(200).json(newMatch))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
