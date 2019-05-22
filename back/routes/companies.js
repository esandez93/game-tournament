// Import dependencies
const express = require('express');
const router = express.Router();

// const CompanyController = require('../../controllers/companies.js');
const Company = require('../db/models/Company')

router.get('/', (req, res, next) => {
  Company.model.find({}).exec()
    .then(companies => res.status(200).json(companies))
    .catch(err => res.status(500).send(error));
});

router.get('/:id', (req, res, next) => {
  Company.model.findById(req.params.id).exec()
    .then(company => res.status(200).json(company))
    .catch(err => res.status(500).send(error));
});

router.post('/', (req, res, next) => {
  let company = Company.populate(req.body);
  company.save()
    .then(comp => res.status(200).json(comp))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
