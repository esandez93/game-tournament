//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }]
});
schema.index({ id: 1 });

const model = mongoose.model('World', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name,
    avatar: data.avatar
  });
}

module.exports = {
  schema,
  model,
  populate
};
