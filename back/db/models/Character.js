//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  }
});
schema.index({ id: 1 });

const model = mongoose.model('Character', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name,
    avatar: data.avatar,
    game: data.game
  });
}

module.exports = {
  schema,
  model,
  populate
};
