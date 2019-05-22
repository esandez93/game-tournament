//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true }
});
schema.index({ id: 1 });

const model = mongoose.model('Company', schema);

function populate (data) {
  if (!data) return;

  return new model({
    name: data.name
  });
}

module.exports = {
  schema,
  model,
  populate
};
