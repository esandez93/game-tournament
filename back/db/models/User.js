//Require Mongoose
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  name: { type: String, required: true },
  email: { type: String, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, required: true },
  avatar: { type: String, trim: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  settings: {
    theme: { type: String, required: true },
    locale: { type: String, required: true }
  }
});
schema.index({ id: 1 });

const model = mongoose.model('User', schema);

function populate (data) {
  if (!data) return;

  return new model({
    username: data.username,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    company: data.company,
    group: data.group,
    settings: {
      theme: data.theme || 'defaultDark',
      locale: data.locale || 'en',
    }
  })
}

module.exports = {
  schema,
  model,
  populate
};
