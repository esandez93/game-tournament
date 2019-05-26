// Import dependencies
const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const MatchController = require('../../controllers/matchess.js');
const Match = require('../db/models/Match');
const MatchController = require('../db/controllers/match.ctrl');
const User = require('../db/models/User');

router.get('/', withAuth, (req, res) => {
  MatchController.find(req.query)
    .then(matches => res.status(200).json(matches))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  MatchController.findById(req.params.id)
    .then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});

router.post('/', withAuth, (req, res) => {
  MatchController.save(req.body)
    .then(match => res.status(200).json(match))
    .catch(err => res.status(500).send(err));
});

module.exports = router;
