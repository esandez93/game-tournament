//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  world: {
    type: mongoose.Schema.Ttypes.ObjectId,
    ref: 'World'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
schema.index({ id: 1 });

const model = mongoose.model('Group', schema);

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
