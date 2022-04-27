// Método wrapper de obtener los distintos comandos de manejo de ficheros de linux
// Si se da una ruta especifica, mostrar si es un directorio o un fichero (HECHO)
// Crear un directorio a partir de una ruta especifica (HECHO)
// Listar ficheros dentro de un directorio (Hecho)
// Mostrar el contenido del fichero (similar a cat) (Hecho)
// Borrar ficheros y directorios (HECHO)
// Mover ficheros o directorios de un punto a, a un punto b
// Hacer uso de yargs para controlar todo esto anterior

import yargs from "yargs";
import chalk from 'chalk';
import * as fs from 'fs';
import inquirer from "inquirer";

yargs.command({
  command: 'file',
  describe: 'Returns the type of a specific item of a route.',
  builder: {
  },
  handler() {
    if (process.argv.length !== 4) {
      console.log(chalk.red('Please, specify a route to the item'));
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js file [route]'));
    } else {
      if (typeof process.argv[3] === 'string') {
        fs.lstat(process.argv[3], (err, stats) => {
          if (err) {
            console.log(chalk.red('The specified path does not exist'));
          } else if (stats.isFile()) {
            console.log(chalk.green('It is a File'));
          } else if (stats.isDirectory()) {
            console.log(chalk.green('It is a directory'));
          }
        });
      }
    }
  },
});

yargs.command({
  command: 'mkdir',
  describe: 'Create a directory at the specific route.',
  builder: {
  },
  handler() {
    if (process.argv.length !== 4) {
      console.log(chalk.red('Please, specify a route to create the item'));
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js mkdir [route]'));
    } else {
      if (typeof process.argv[3] === 'string') {
        fs.mkdir(process.argv[3], (err) => {
          if (err) {
            console.log(chalk.red('The specified path already exist.'));
          } else {
            console.log(chalk.green('The directory was succefully created'));
          }
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
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js ls [route]'));
    } else {
      if (typeof process.argv[3] === 'string') {
        fs.readdir(process.argv[3], (err, data) => {
          if (err) {
            console.log(chalk.red('The specified path is wrong'));
          } else {
            data.forEach((item) => {
              console.log(chalk.cyan(item));
            });
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
      console.log(chalk.red('Please, specify a route to show the content of a file.'));
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js cat [route]'));
    } else {
      if (typeof process.argv[3] === 'string') {
        fs.readFile(process.argv[3], (err, data) => {
          if (err) {
            console.log(chalk.red('The file specified does not exist.'));
          } else {
            console.log(data.toString());
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
      console.log(chalk.red('Please, specify a route to delete a file or directory.'));
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js rm [route]'));
    } else {
      if (typeof process.argv[3] === 'string') {
        inquirer.prompt({type: "confirm", name: "Continue", message: `Are you sure to delete ${process.argv[3]} ?`})
            .then((answers) => {
              if (answers["Continue"] === true) {
                fs.unlink(process.argv[3], (err) => {
                  if (err) { // If the path is a directory
                    fs.lstat(process.argv[3], (err, stats) => {
                      if (err) {
                        console.log(chalk.red('The specified path does not exist'));
                      } else if (stats.isFile()) {
                        console.log(chalk.green('There must be a problem to delete the File'));
                      } else if (stats.isDirectory()) {
                        fs.rmdir(process.argv[3], (err) => {
                          if (err) {
                            console.log(chalk.red('There must be a problem to delete the directory'));
                          } else {
                            console.log(chalk.green('The directory was succefully deleted'));
                          }
                        });
                      }
                    });
                  } else {
                    console.log(chalk.green('The file was succefully deleted'));
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

yargs.command({ // COMPROBAR ESTE COMANDO, EXISTE UN PROBLEMA
  command: 'cp',
  describe: 'Copy and move files or directorys',
  builder: {
  },
  handler() {
    if (process.argv.length !== 5) {
      console.log(chalk.red('Please, specify a route to obtain the file or directory and the destination.'));
      console.log(chalk.yellow('The structure of the command is: node dist/exercice4/exercice4.js cp [Origin] [Destination]'));
    } else {
      if ((typeof process.argv[3] === 'string') && (typeof process.argv[4] === 'string')) {
        fs.lstat(process.argv[3], (err, stats) => {
          if (err) {
            console.log(chalk.red('There must be a problem'));
          } else if (stats.isFile()) {
            fs.copyFile(process.argv[3], process.argv[4], (err) => {
              if (err) {
                console.log(chalk.red('There must be a problem to copy the File'));
              } else {
                console.log(chalk.green('The File was succefully copied'));
              }
            });
          } else if (stats.isDirectory()) {
            fs.cp(process.argv[3], process.argv[4], (err) => {
              if (err) {
                console.log(chalk.red('There must be a problem to copy the directory'));
              } else {
                console.log(chalk.green('The directory was succefully copied'));
              }
            });
          }
        });
      }
    }
  },
});

yargs.parse();
