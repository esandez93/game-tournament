const chalk = require('chalk');

const log = (color, ...args) => console.log(color(...args));


exports.info = (...args) => log(chalk.italic.blue, ...args);
exports.warn = (...args) => log(chalk.yellow, ...args);
exports.error = (...args) => log(chalk.bold.red, ...args);
