const Match = require('../models/Match');
const User = require('../models/User');
const utils = require('../utils');

const populatePlayer = (num) => ({
  path: `player${num}.user`,
  populate: { path: 'company' }
});

function find (options = {}) {
  options.populate = [ populatePlayer(1), populatePlayer(2) ];
  return utils.prepareMongooseReq(Match.model, 'find', options);
}

function findById (id) {
  return Match.model.findById(id)
    .populate(populatePlayer(1))
    .populate(populatePlayer(2));
}

function save (body) {
  return new Promise((resolve, reject) => {
    let match = Match.populate(body);
    match.save()
      .then(newMatch => {
        findById(newMatch.id)
          .then(resolve)
          .catch(reject);
      })
      .catch(reject);
  });
}

module.exports = {
  find,
  findById,
  save
}
