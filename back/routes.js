const users = require('./routes/users');
const companies = require('./routes/companies');
const matches = require('./routes/matches');
const characters = require('./routes/characters');

module.exports = function (app) {
  app.get('/', (req, res, next) => {
    res.status(200).send(`Welcome to the Tekken Tournament API!`);
  });

  app.use('/users', users);
  app.use('/companies', companies);
  app.use('/matches', matches);
  app.use('/characters', characters);
};
