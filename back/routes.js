const withAuth = require('./middleware/withAuth');

const users = require('./routes/users');
const companies = require('./routes/companies');
const matches = require('./routes/matches');
const characters = require('./routes/characters');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.status(200).send(`Welcome to the Tekken Tournament API!`);
  });

  app.get('/checkToken', withAuth, (req, res) => res.sendStatus(200));

  app.use('/users', users);
  app.use('/companies', companies);
  app.use('/matches', matches);
  app.use('/characters', characters);
};
