//Require Mongoose
const mongoose = require('mongoose');

const Player = {
  team: {
    type: Array,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}

const schema = new mongoose.Schema({
  player1: Player,
  player2: Player,
  blindPick: Boolean,
  date: { type: Date, required: true },
  result: { type: Number, required: true }
});
schema.index({ id: 1 });

const model = mongoose.model('Match', schema);

function populate (data) {
  if (!data) return;

  return new model({
    player1: data.player1,
    player2: data.player2,
    blindPick: data.blindPick || false,
    date: new Date(),
    result: data.result
  });
}

module.exports = {
  schema,
  model,
  populate
};
