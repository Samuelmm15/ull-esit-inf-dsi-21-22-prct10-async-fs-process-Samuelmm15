import yargs from "yargs";
import chalk from 'chalk';
import * as fs from 'fs';
import inquirer from "inquirer";
import {spawn} from "child_process";

export class CommandProgram {
  constructor() {
    this.run();
  }
  private run(): void {
    yargs.command({
      command: 'file',
      describe: 'Returns the type of a specific item of a path.',
      builder: {
      },
      handler() {
        if (process.argv.length !== 4) {
          console.log(chalk.red('Please, specify a path to the item'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js file [path]'));
        } else {
          if (typeof process.argv[3] === 'string') {
            fs.access(process.argv[3], fs.constants.F_OK, (err) => {
              if (err) {
                console.log(chalk.red('The introduced path was wrong'));
              } else {
                const file = spawn('file', [process.argv[3]]);
                file.stdout.pipe(process.stdout);
              }
            });
          }
        }
      },
    });

    yargs.command({
      command: 'mkdir',
      describe: 'Create a directory at the specific path.',
      builder: {
      },
      handler() {
        if (process.argv.length !== 4) {
          console.log(chalk.red('Please, specify a path to create the item'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js mkdir [path]'));
        } else {
          if (typeof process.argv[3] === 'string') {
            const mkdir = spawn('mkdir', [process.argv[3]]);
            mkdir.on('close', () => {
              console.log(chalk.green('The directory was succefully created'));
            });
          }
        }
      },
    });

    yargs.command({
      command: 'ls',
      describe: 'List the content of a specific path',
      builder: {
      },
      handler() {
        if (process.argv.length !== 4) {
          console.log(chalk.red('Please, specify a route to list the items'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js ls [path]'));
        } else {
          if (typeof process.argv[3] === 'string') {
            fs.access(process.argv[3], fs.constants.F_OK, (err) => {
              if (err) {
                console.log('The introduced path was wrong');
              } else {
                const ls = spawn('ls', [process.argv[3]]);
                ls.stdout.pipe(process.stdout);
              }
            });
          }
        }
      },
    });

    yargs.command({
      command: 'cat',
      describe: 'Show the content of a specified file.',
      builder: {
      },
      handler() {
        if (process.argv.length !== 4) {
          console.log(chalk.red('Please, specify a path to show the content of a file.'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js cat [path]'));
        } else {
          if (typeof process.argv[3] === 'string') {
            fs.access(process.argv[3], fs.constants.F_OK, (err) => {
              if (err) {
                console.log(chalk.red('The specified path was wrong'));
              } else {
                const cat = spawn('cat', [process.argv[3]]);
                cat.stdout.pipe(process.stdout);
              }
            });
          }
        }
      },
    });

    yargs.command({
      command: 'rm',
      describe: 'Delete files and directorys.',
      builder: {
      },
      handler() {
        if (process.argv.length !== 4) {
          console.log(chalk.red('Please, specify a path to delete a file or directory.'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js rm [path]'));
        } else {
          if (typeof process.argv[3] === 'string') {
            inquirer.prompt({type: "confirm", name: "Continue", message: `Are you sure to delete ${process.argv[3]} ?`})
                .then((answers) => {
                  if (answers["Continue"] === true) {
                    fs.lstat(process.argv[3], (err, stats) => {
                      if (err) {
                        console.log(chalk.red('The specified path does not exist'));
                      } else if (stats.isFile()) {
                        const rm = spawn('rm', [process.argv[3]]);
                        rm.on('close', () => {
                          console.log(chalk.green('The File was succefully deleted'));
                        });
                      } else if (stats.isDirectory()) {
                        const rmdir = spawn('rmdir', [process.argv[3]]);
                        rmdir.on('close', () => {
                          console.log(chalk.green('The directory was succefully deleted'));
                        });
                      }
                    });
                  } else {
                    console.log(chalk.red('The file or directory was not deleted'));
                  }
                });
          }
        }
      },
    });

    yargs.command({
      command: 'cp',
      describe: 'Copy and move files or directorys',
      builder: {
      },
      handler() {
        if (process.argv.length !== 5) {
          console.log(chalk.red('Please, specify a path to obtain the file or directory and the destination.'));
          console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js cp [Origin] [Destination]'));
        } else {
          if ((typeof process.argv[3] === 'string') && (typeof process.argv[4] === 'string')) {
            fs.lstat(process.argv[3], (err, stats) => {
              if (err) {
                console.log(chalk.red('There must be a problem'));
              } else if (stats.isFile()) {
                fs.access(process.argv[3], fs.constants.F_OK, (err) => {
                  if (err) {
                    console.log(chalk.red('The first introduced path is wrong'));
                  } else {
                    fs.access(process.argv[4], fs.constants.F_OK, (err) => {
                      if (err) {
                        console.log(chalk.red('The second introduced path is wrong'));
                      } else {
                        const mv = spawn('mv', [process.argv[3], process.argv[4]]);
                        mv.on('close', () => {
                          console.log(chalk.green('The File was succefully moved'));
                        });
                      }
                    });
                  }
                });
              } else if (stats.isDirectory()) {
                fs.access(process.argv[3], fs.constants.F_OK, (err) => {
                  if (err) {
                    console.log(chalk.red('The first introduced path is wrong'));
                  } else {
                    fs.access(process.argv[4], fs.constants.F_OK, (err) => {
                      if (err) {
                        console.log(chalk.red('The second introduced path is wrong'));
                      } else {
                        const cp = spawn('cp', ['-r', process.argv[3], process.argv[4]]);
                        cp.on('close', () => {
                          console.log(chalk.green('The directory was succefully copied'));
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        }
      },
    });
    yargs.parse();
  }
}

// eslint-disable-next-line no-unused-vars
const commandProgramObj = new CommandProgram();

