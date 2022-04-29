/* eslint-disable comma-dangle */

import * as fs from 'fs';
import chalk from 'chalk';
import yargs from 'yargs';

yargs.command({
  command: 'route',
  describe: 'Specifies the path of the directory to watch',
  builder: {
  },
  handler() {
    if (process.argv.length !== 4) {
      console.log(chalk.red('Enter the execution correctly'));
      console.log(chalk.yellow('node dist/exercice3/watchProgram.js route [path]'));
    } else {
      fs.access(process.argv[3], fs.constants.F_OK, (err) => {
        if (err) {
          console.log(chalk.red('The specified path does not exist'));
          console.log(chalk.green('Specified a new path'));
        } else {
          fs.watch(process.argv[3], {persistent: true}, (eventType, filename) => {
            if (eventType === 'change') {
              console.clear();
              console.log(chalk.green(`Added a new File called ${filename}`));
            } else if (eventType === 'rename') {
              console.clear();
              console.log(chalk.green(`Removed the File called ${filename}`));
            }
          });
        }
      });
    }
  },
});

yargs.parse();

