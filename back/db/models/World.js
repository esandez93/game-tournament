//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
schema.index({ id: 1 });

const model = mongoose.model('World', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name,
    avatar: data.avatar,
    games: data.games,
    admins: data.admins
  });
}

module.exports = {
  schema,
  model,
  populate
};
