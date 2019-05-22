const http = require('http');
const logger = require('@game-tournament/logger');

/**
 * Get port from environment and store in Express.
 */
module.exports = function (app) {
  const port = process.env.PORT || '3020';
  const host = '192.168.1.48';
  app.set('port', port);

  /**
  * Create HTTP server.
  */
  const server = http.createServer(app);

  /**
  * Listen on provided port, on all network interfaces.
  */
  server.listen(port, () => logger.info(`API running on ${host}:${port}`));
}
