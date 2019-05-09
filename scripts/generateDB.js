/* This script generates mock data for local development.
   This way you don't have to point to an actual API,
   but you can enjoy realistic, but randomized data,
   and rapid page loads due to local, static data.
 */

/* eslint-disable no-console */

import jsf from 'json-schema-faker';
import fs from 'fs';
import chalk from 'chalk';
import schema from '../schema';
var path = require('path');

jsf.resolve(schema).then((db) => {
  fs.writeFile(`${process.cwd()}/db.json`, JSON.stringify(db), function (err) {
    if (err) {
      return console.log(chalk.red(err));
    } else {
      console.log(chalk.green("Mock data generated."));
    }
  });
});
