// Método wrapper de obtener los distintos comandos de manejo de ficheros de linux
// Si se da una ruta especifica, mostrar si es un directorio o un fichero (HECHO)
// Crear un directorio a partir de una ruta especifica
// Listar ficheros dentro de un directorio
// Mostrar el contenido del fichero (similar a cat)
// Borrar ficheros y directorios
// Mover ficheros o directorios de un punto a, a un punto b
// Hacer uso de yargs para controlar todo esto anterior

import yargs from "yargs";
import chalk from 'chalk';
import * as fs from 'fs';

yargs.command({
  command: 'type',
  describe: 'Returns the type of a specific item of a route',
  builder: {
    route: {
      describe: 'The specific route of the item',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === 'string') {
      fs.lstat(argv.route, (err, stats) => {
        if (err) {
          console.log(chalk.red('Se ha producido un error'));
        }
        if (stats.isFile()) {
          console.log(chalk.green('Is a file'));
        }
        if (stats.isDirectory()) {
          console.log(chalk.green('Is a directory'));
        }
      });
    }
  },
});

yargs.parse();
