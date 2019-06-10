//Require Mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  username: { type: String, trim: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, required: true },
  avatar: { type: String, trim: true },
  friends: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  worlds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'World'
  }],
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  mainGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  settings: {
    theme: { type: String, required: true },
    locale: { type: String, required: true }
  }
});
schema.index({ id: 1 });

const SALT_ROUNDS = 10;
schema.pre('save', function (next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, SALT_ROUNDS, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});
schema.methods.isCorrectPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, same) => {
      if (err) {
        reject(err);
      } else {
        resolve(same);
      }
    });
  });
}

const model = mongoose.model('User', schema);

function populate (data) {
  if (!data) return;

  if (!data.settings) {
    data.settings = {};
  }

  return new model({
    username: data.username,
    password: data.password,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    worlds: data.worlds,
    group: data.group,
    mainGame: data.mainGame,
    settings: {
      theme: data.settings.theme || 'defaultDark',
      locale: data.settings.locale || 'en',
    }
  })
}

module.exports = {
  schema,
  model,
  populate
};
