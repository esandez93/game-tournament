//Import the mongoose module
const mongoose = require('mongoose');
const logger = require('@tekken-tournament/logger');

//Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB)
.then(() => {
  logger.info('Mongoose connected');
}, (error) => {
  logger.warn('Error connecting Mongoose:', error);
});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', logger.error.bind(console, 'MongoDB connection error:'));