//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String }
});
schema.index({ id: 1 });

const model = mongoose.model('Game', schema);

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
