//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  logos: {
    favicon: { type: String },
    banner: { type: String }
  },
  characters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Character'
  }],
  world: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'World'
  },
  creationDate: {
    type: Date,
    required: true
  },
  lastUpdate: {
    type: Date,
    required: true
  }
});
schema.index({ id: 1 });

const model = mongoose.model('Game', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name,
    logos: data.logos,
    world: data.world,
    characters: data.characters || [],
    creationDate: data.creationDate,
    lastUpdate: data.lastUpdate
  });
}

module.exports = {
  schema,
  model,
  populate
};
