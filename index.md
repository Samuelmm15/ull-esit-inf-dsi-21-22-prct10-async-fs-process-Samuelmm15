# / PRÁCTICA 10 - SISTEMA DE FICHEROS Y CREACIÓN DE PROCESOS EN NODE.JS

## // Índice
1. [Tareas Previas](#id1)
2. [Ejercicios](#id2) \
    2.1 [Ejercicio 1](#id3) \
    2.2 [Ejercicio 2](#id4) \
    2.3 [Ejercicio 3](#id5) \
    2.4 [Ejercicio 4](#id6)
3. [Pruebas y testeos](#id7)
4. [Conclusión](#id8)

## // Tareas previas <a name="id1"></a>

Para la realización de la décima práctica de la asignatura `Desarrollo de Sistemas Informáticos` se ha solicitado la lectura de dos documentos, relacionados con las API de callbacks que sirven para interactuar con el sistema de ficheros y, por otro lado, las API asíncronas que sirven para crear procesos.

El [primero](https://nodejs.org/dist/latest-v18.x/docs/api/fs.html#callback-api)
de estos documentos nos permite entender un poco más sobre las distintas API que existen para interacturar con el sistema de ficheros, haciendo uso de Node js.

Por otro lado, el [segundo](https://nodejs.org/dist/latest-v18.x/docs/api/child_process.html#asynchronous-process-creation)
de estos documentos, nos informa sobre las API asíncronas que existen en Node js para poder crear procesos.

Teniendo en cuenta todo esto anterior, se consigue entender un poco más sobre algunas de las funcionalidades que nos presenta Node js.

## // Ejercicios <a name="id2"></a>

Para la realización de los distintos ejercicios solicitados para la práctica, se hace uso de distintos ficheros dentro del directorio `/src` con el contenido y las funcionalidades solicitadas para cada uno de los problemas.

### /// Ejercicio 1 <a name="id3"></a>

Para la realización del primer ejercicio, se solicita que, a partir del siguiente fragmento de código:

```
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
```

Se obtenga la traza de ejecución del programa que se puede observar anteriormente, mostrando así, el contenido de la pila de llamadas, el registro de eventos de la API, la cola de manejadores, y lo que se muestra por pantalla.

Como se puede observar a continuación, la traza de ejecución del programa es la siguiente:
### /// Contenido de la pila de llamadas:
1.
```
if (process.argv.length !== 3) {
 console.log('Please, specify a file');
}
```
2.
```
const filename = process.argv[2];
access(filename, constants.F_OK, (err) => {});
```
3.
```
if (err) {
   console.log(`File ${filename} does not exist`);
 } else {
   console.log(`Starting to watch file ${filename}`);
 }
   const watcher = watch(process.argv[2]);
}
```
4.
```
watcher.on('change', () => {
  console.log(`File ${filename} has been modified somehow`);
}
```
5.
```
console.log(`File ${filename} is no longer watched`);
```

### /// Registro de eventos de la API:
1.
```
(err) => {
 if (err) {
   console.log(`File ${filename} does not exist`);
 } else {
   console.log(`Starting to watch file ${filename}`);
 }
}
```
2.
```
const watcher = watch(process.argv[2]);
watcher.on('change', () => {
  console.log(`File ${filename} has been modified somehow`);
}
```

### /// Cola de manejadores:
1.
```
(err) => {
 if (err) {
   console.log(`File ${filename} does not exist`);
 } else {
   console.log(`Starting to watch file ${filename}`);
 }
}
```
2.
```
watcher.on('change', () => {
  console.log(`File ${filename} has been modified somehow`);
}
```

### // Contenido mostrado por consola:
1.
> Please, specify a file
2.
> Starting to watch file helloWorld.txt
3.
> File helloWorld.txt is no longer watched
4.
> File helloWorld.txt has been modified somehow
5.
> File helloWorld.txt is no longer watched
6.
> File helloWorld.txt has been modified somehow
7.
> File helloWorld.txt is no longer watched

### /// Funcionamiento de la función `access`
El método `access` sirve para comprobar permisos de un archivo o directorio que quede especificado
mediante la ruta que se le haya pasado a dicho método.

Los permisos que son especificados para que puedan ser comprobados en dicho fichero o directorio,
son declarados mediante el objeto `constants`.

### /// Utilidad del objeto `constants`
El objeto `constats` sirve para poder definir los permisos que se pretenden que sean comprobados dentro
del fichero o directorio que se quiere.

Para el código anterior, se tiene que:
```
fs.constants.F_OK
```
Esto anterior indica que se comprueban los permisos de lectura, escritura y ejecución, es decir, se comprueba si,
el fichero posee activos estos tres permisos para dicho usuario.

Existen otros tipos de permisos como pueden ser:
```
fs.constants.R_OK   // Permisos de escritura
fs.constants.W_OK   // Permisos de lectura
fs.constants.X_OK   // Permisos de ejecución
```

### /// Ejercicio 2 <a name="id4"></a>

Para el segundo ejercicio, se solicita un programa que devuelva el número de ocurencias de una palabra, que existe dentro de un fichero de texto. Para ello, se expande el comando de Linux `cat` y `grep`. Pero, estas operaciones se pueden realizar de dos maneras:

La primera de ellas, se realiza haciendo uso de el método `pipe` de un `Stream` que permite redirigir la salida de un comando, para este caso, primero del comando `cat`, hacia el comando `grep`. Posteriormente, se realiza el conteo del número de coincidencias que existen dentro del fichero de texto.

Dicha resolución se puede observar a continuación:

```
 private firstMethod() {
    const cat = spawn('cat', [this.fileRoute]);
    const grep = spawn('grep', [this.word]);
    cat.stdout.pipe(grep.stdin);
    let auxiliaryGrep = '';
    let counter: number = 0;
    grep.stdout.on('data', (piece) => {
      auxiliaryGrep = piece.toString();
    });
    grep.on('close', () => {
      console.log();
      console.log(chalk.green('File Content:'));
      console.log(chalk.grey(auxiliaryGrep));
      const result = auxiliaryGrep.split(/\s+/);
      result.forEach((item) => {
        if (item === this.word) {
          counter++;
        }
      });
      if (counter === 0) {
        console.log();
        console.log(chalk.red(`There is no match of the filter ${this.word}`));
      } else {
        console.log();
        console.log(chalk.blue(`The number of coincidencis is ${counter}`));
      }
    });
  }
  private secondMethod() { // Esto es sin el método pipe
    const catGrep = spawn('cat', [this.fileRoute, 'grep', this.word]);
    let counter: number = 0;
    let catGrepAuxiliary = '';
    catGrep.stdout.on('data', (piece) => {
      catGrepAuxiliary = piece.toString();
    });
    catGrep.on('close', () => {
      console.log();
      console.log(chalk.green('File Content:'));
      console.log(chalk.grey(catGrepAuxiliary));
      const result = catGrepAuxiliary.split(/\s+/);
      result.forEach((item) => {
        if (item === this.word) {
          counter++;
        }
      });
      if (counter === 0) {
        console.log();
        console.log(chalk.red(`There is no match of the filter ${this.word}`));
      } else {
        console.log();
        console.log(chalk.blue(`The number of coincidencis is ${counter}`));
      }
    });
  }
}
```

El segundo modo de poder resolver el problema, se encuentra en el uso del método `pipe`, pero en este caso no se va a redirigir la salida de un comando a otro, sino que, se hace uso de los subprocesos que sean necesarios para la resolución del problema.

Esta segunda forma de resolver el problema se puede observar a continuación:

```
private secondMethod() {
    const catGrep = spawn('cat', [this.fileRoute, 'grep', this.word]);
    let counter: number = 0;
    let catGrepAuxiliary = '';
    catGrep.stdout.on('data', (piece) => {
      catGrepAuxiliary = piece.toString();
    });
    catGrep.on('close', () => {
      console.log();
      console.log(chalk.green('File Content:'));
      console.log(chalk.grey(catGrepAuxiliary));
      const result = catGrepAuxiliary.split(/\s+/);
      result.forEach((item) => {
        if (item === this.word) {
          counter++;
        }
      });
      if (counter === 0) {
        console.log();
        console.log(chalk.red(`There is no match of the filter ${this.word}`));
      } else {
        console.log();
        console.log(chalk.blue(`The number of coincidencis is ${counter}`));
      }
    });
  }
```

### /// Ejercicio 3 <a name="id5"></a>

Para la realización del tercer ejercicio, se solicita el empleo de la aplicación de notas desarrollada para la **Práctica 9** de la asignatura. Pero, para este ejercicio número tres se hace uso del método `watch`, que, permite observar los cambios que se producen dentro del sistema de ficheros, además, incluye la opción de determinar el tipo de cambio que se ha producido dentro de este.

<!-- FALTA CONTESTAR A LAS PREGUNTAS -->

### /// Ejercicio 4 <a name="id6"></a>

Para el cuarto y último ejercicio de la décima práctica de la asignatura, se desarrolla una aplicación que permite hacer uso de los distintos comandos empleados en Linux para el manejo de ficheros y directorio.

El primero de estos comandos es `file`, este, permite determinar el tipo de fichero que es, tras introducir una ruta concreta. La implementación de dicho comando es:

```
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
```

El segundo de los comandos solicitados es `mkdir`, permitiendo crear nuevos directorios a partir de una ruta que es pasada como parámtro.

```
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
```

A continuación, se desarrolla el comando `ls` que permite listar los distintos ficheros que existen dentro de un directorio. La implementación de esto comentado anteriormente, se puede observar:

```
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
```

Por otro lado, se solicita el comando `cat`, que , permite mostrar el contenido de un fichero en concreto.

```
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
```

El quinto comando es `rm` y `rmdir`, ya que, se permite la eliminación de ficheros y directorios, a partir de una ruta especificada.

```
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
```

<!-- FALTA POR TERMINAR ESTE APARTADO -->
Por último, se tiene el comando `cp`, que permite copiar ficheros y directorios, a partir de una ruta origen y una ruta destino que ha sido especificada.

### /// Pruebas y testeos <a name="id7"></a>

### // Conclusión <a name="id8"></a>

Para concluir, este décima práctica de la asignatura, me ha permitido comprender un poco mejor, el manejo, empleo y creación de procesos en Node js, ya que, en ocasiones, me han generado ciertos problemas debido al desconocimiento en el correcto empleo de esto.

Además, el desarrollo de los distintos ejercicios, me ha ayudado a conocer nuevas API que proporciona Node js y que tienen gran utilidad para el correcto manejo del sistema de ficheros.
