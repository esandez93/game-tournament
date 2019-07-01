const withAuth = require('./middleware/withAuth');

const auth = require('./routes/auth');
const users = require('./routes/users');
const games = require('./routes/games');
const worlds = require('./routes/worlds');
const matches = require('./routes/matches');
const characters = require('./routes/characters');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.status(200).send(`Welcome to the Tekken Tournament API!`);
  });

  // TODO: Error handling of params in all routes
  // TODO: Create controllers to keep logic outside routes
  app.use('/auth', auth);
  app.use('/games', games);
  app.use('/users', users);
  app.use('/worlds', worlds);
  app.use('/matches', matches);
  app.use('/characters', characters);
};
