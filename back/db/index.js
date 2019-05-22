// Import the mongoose module
const mongoose = require('mongoose');
const logger = require('@game-tournament/logger');
const normalizeDocuments = require('./plugins/normalizeDocuments')

// Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB)
.then(() => {
  logger.info('Mongoose connected');
}, (error) => {
  logger.warn('Error connecting Mongoose:', error);
});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Add necessary plugins
mongoose.plugin(normalizeDocuments);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', logger.error.bind(console, 'MongoDB connection error:'));
