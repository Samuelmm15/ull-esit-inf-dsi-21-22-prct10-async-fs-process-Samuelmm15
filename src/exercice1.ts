/* eslint-disable no-trailing-spaces */
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}

/**
 * ## // Contenido de la pila de llamadas: // cada vez que se ejucuta una zona de código
 * 1.
 * ```
 * if (process.argv.length !== 3) {
 *  console.log('Please, specify a file');
 * }
 * ```
 * 2.
 * ```
 * const filename = process.argv[2];
 * access(filename, constants.F_OK, (err) => {});
 * ```
 * 3.
 * ```
 * if (err) {
 *    console.log(`File ${filename} does not exist`);
 *  } else {
 *    console.log(`Starting to watch file ${filename}`);
 *  }
 *    const watcher = watch(process.argv[2]);
 * }
 * ```
 * 4.
 * ```
 * watcher.on('change', () => {
 *   console.log(`File ${filename} has been modified somehow`);
 * }
 * ```
 * 5.
 * ```
 * console.log(`File ${filename} is no longer watched`);
 * ```
 * 
 * ## // Registro de eventos de la API: // cuando se queda algo que se queda esperando por un evento
 * 1.
 * ```
 * (err) => {
 *  if (err) {
 *    console.log(`File ${filename} does not exist`);
 *  } else {
 *    console.log(`Starting to watch file ${filename}`);
 *  }
 * }
 * ```
 * 2.
 * ```
 * const watcher = watch(process.argv[2]);
 * watcher.on('change', () => {
 *   console.log(`File ${filename} has been modified somehow`);
 * }
 * ```
 * 
 * ## // Cola de manejadores: // Cuando se genera un call back o manejador
 * 1.
 * ```
 * (err) => {
 *  if (err) {
 *    console.log(`File ${filename} does not exist`);
 *  } else {
 *    console.log(`Starting to watch file ${filename}`);
 *  }
 * }
 * ```
 * 2.
 * ```
 * watcher.on('change', () => {
 *   console.log(`File ${filename} has been modified somehow`);
 * }
 * ```
 * 
 * ## // Contenido mostrado por consola: // Contenido mostrado por consola
 * 1.
 * > Please, specify a file
 * 2.
 * > Starting to watch file helloWorld.txt
 * 3.
 * > File helloWorld.txt is no longer watched
 * 4.
 * > File helloWorld.txt has been modified somehow
 * 5.
 * > File helloWorld.txt is no longer watched
 * 6.
 * > File helloWorld.txt has been modified somehow
 * 7.
 * > File helloWorld.txt is no longer watched
 * 
 * ## // Funcionamiento de la función `access`
 * El método `access` sirve para comprobar permisos de un archivo o directorio que quede especificado
 * mediante la ruta que se le haya pasado a dicho método.
 * 
 * Los permisos que son especificados para que puedan ser comprobados en dicho fichero o directorio,
 * son declarados mediante el objeto `constants`.
 * 
 * ## // Utilidad del objeto `constants`
 * El objeto `constats` sirve para poder definir los permisos que se pretenden que sean comprobados dentro
 * del fichero o directorio que se quiere.
 * 
 * Para el código anterior, se tiene que:
 * ```
 * fs.constants.F_OK
 * ```
 * Esto anterior indica que se comprueban los permisos de lectura, escritura y ejecución, es decir, se comprueba si,
 * el fichero posee activos estos tres permisos para dicho usuario.
 * 
 * Existen otros tipos de permisos como pueden ser:
 * ```
 * fs.constants.R_OK   // Permisos de escritura
 * fs.constants.W_OK   // Permisos de lectura
 * fs.constants.X_OK   // Permisos de ejecución
 * ```
 */
