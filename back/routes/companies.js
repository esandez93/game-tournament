// Import dependencies
const express = require('express');
const withAuth = require('../middleware/withAuth');
const router = express.Router();

// const CompanyController = require('../../controllers/companies.js');
const Company = require('../db/models/Company')

router.get('/', withAuth, (req, res) => {
  Company.model.find({}).exec()
    .then(companies => res.status(200).json(companies))
    .catch(err => res.status(500).send(err));
});

router.get('/:id', withAuth, (req, res) => {
  Company.model.findById(req.params.id).exec()
    .then(company => res.status(200).json(company))
    .catch(err => res.status(500).send(err));
});

router.post('/', withAuth, (req, res) => {
  let company = Company.populate(req.body);
  company.save()
    .then(comp => res.status(200).json(comp))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
