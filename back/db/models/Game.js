//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  logos: {
    favicon: { type: String },
    banner: { type: String }
  }
});
schema.index({ id: 1 });

const model = mongoose.model('Game', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name,
    logos: data.logos
  });
}

module.exports = {
  schema,
  model,
  populate
};
