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

Como se puede observar en el fragmento de código adjunto a continuación, la implementación del método `watch` para determinar si dentro de un directorio se ha producido un cambio, y, además, determinar el tipo de cambio que es, es de la manera:

```
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
```

Para finalizar con este tercera tarea, se han de responder una serie de preguntas:
- ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?

Para poder mostrar el contenido del fichero creado o modificado, en este caso se puede hacer uso de la expansión del comando de linux `cat`, que permite mostrar el contenido del fichero que ha sido creado o que se ha modificado. Es por ello que cuando se produce un evento en el directorio del tipo de crear un nuevo fichero o que haya sido modificado uno existente, pues se aplica el método `spawn()` que permite extender el comando cat de linux, pudiendo mostrar el contenido de dicho fichero.

- ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

Para poder observar el directorio que contiene todos los directorios correspondientes con los distintos usaurios de la aplicación de notas, es necesario establecer esta ruta como ruta del directorio que va a ser observado, por tanto, si se produce algún cambio dentro de este directorio, se va a registrar un evento y por tanto, podrá ser mostrado por pantalla el tipo de evento que se ha producido.

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
            const mkdir = spawn('mkdir', [process.argv[3]]);
            mkdir.on('close', () => {
              console.log(chalk.green('The directory was succefully created'));
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
```

Por último, se tiene el comando `cp`, que permite copiar ficheros y directorios, a partir de una ruta origen y una ruta destino que ha sido especificada.

```
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
```

### /// Pruebas y testeos <a name="id7"></a>

- Prueba y testeo del ejercicio 2:

  - Comprobación de la primera manera:

    Forma de ejecutar:

    ```
    samu@Samuel:/mnt/c/Users/samue/Documents/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15$ node dist/exercice2/exercice2.js catGrepOption --file="src/Files/test.txt" --word="nombre" --method="1"
    ```

    Resultado:

    ```
    File Content:
    Hola mi nombre es Samu y aquí hay un segundo Hola


    The number of coincidencis is 1
    ```

    [IMAGEN]

    Ejecución:

    ```
    samu@Samuel:/mnt/c/Users/samue/Documents/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15$ node dist/exercice2/exercice2.js catGrepOption --file="src/Files/example.txt" --word="Hola" --method="1"
    ```

    Resultado:

    ```
    The file that is triying to use does not exist
    ```

    [IMAGEN]

  - Comprobación de la segunda manera:

    Forma de ejecutar:

    ```
    samu@Samuel:/mnt/c/Users/samue/Documents/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15$ node dist/exercice2/exercice2.js catGrepOption --file="src/Files/test.txt" --word="Hola" --method="2"
    ```

    Resultado:

    ```
    File Content:
    Hola esto es una prueba
    Hola mi nombre es Samu y aquí hay un segundo Hola

    The number of coincidencis is 3
    ```

    [IMAGEN]

    Ejecución:

    ```
    samu@Samuel:/mnt/c/Users/samue/Documents/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15$ node dist/exercice2/exercice2.js catGrepOption --file="src/Files/example.txt" --word="Hola" --method="2"
    ```

    Resultado:

    ```
    The file that is triying to use does not exist
    ```

    [IMAGEN]

- Prueba y testeo del ejercicio 3:

  Ejecución terminal 1:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice3/watchProgram.js route src/exercice3/notes/Samuel/
  ```

  Ejecución terminal 2:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice3/exercice3.js add --user="Samuel" --title="newNote" --body="This i a test" --colour="yellow"
  ```

  Resultado terminal 1:

  ```
  Added a new File called newNote.json
  ```

  [IMAGEN]

  Ejecución terminal 2:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice3/exercice3.js remove --user="Samuel" --title="newNote"
  ```

  Resultado terminal 1:

  ```
  Removed the File called newNote.json
  ```

  [IMAGEN]

  Ejecución terminal 1:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice3/watchProgram.js route src/exercice3/notes/Samu
  ```

  Resultado terminal 1:

  ```
  The specified path does not exist
  Specified a new path
  ```

  [IMAGEN]

- Prueba y testeo del ejercicio 4:

  Ejecución comando 1:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js mkdir test-dir
  ```

  Resultado comando 1:

  ```
  The directory was succefully created
  ```

  [IMAGEN]

  Ejecución comando 2:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js file test-dir
  ```

  Resultado comando 2:

  ```
  test-dir
  ```

  [IMAGEN]

  Ejecución comando 2:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js file index.md 
  ```

  Resultado comando 2:

  ```
  index.md: Java source, UTF-8 Unicode text, with very long lines
  ```

  [IMAGEN]

  Ejecución comando 3:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js ls src/
  ```

  Resultado comando 3:

  ```
  Files
  Modification
  exercice1
  exercice2
  exercice3
  exercice4
  ```

  [IMAGEN]

  Ejecución del comando 4:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js cat README.md 
  ```

  Resultado del comando 4:

  ```
  # ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15
  ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15 created by GitHub Classroom

  Name: Samuel \
  Surname: Martín Morales \
  Course: Desarrollo de Sistemas Informáticos

  [![Coveralls](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/coveralls.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/coveralls.yml)

  [![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/tests.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/tests.js.yml)

  [![SonarCloud](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/build.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15/actions/workflows/build.yml)

  [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15)
  ```

  [IMAGEN]

  Ejecución del comando 5:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js rm test-dir/
  ```

  Resultado del comando 5:

  ```
  ? Are you sure to delete test-dir/ ? Yes
  The directory was succefully deleted
  ```

  [IMAGEN]

  Ejecución del comando 6:

  ```
  [~/ull-esit-inf-dsi-21-22-prct10-async-fs-process-Samuelmm15(main)]$node dist/exercice4/exercice4.js cp README.md src/
  ```

  Resultado del comando 6:

  ```
  The File was succefully moved
  ```

  [IMAGEN]

### // Conclusión <a name="id8"></a>

Para concluir, este décima práctica de la asignatura, me ha permitido comprender un poco mejor, el manejo, empleo y creación de procesos en Node js, ya que, en ocasiones, me han generado ciertos problemas debido al desconocimiento en el correcto empleo de esto.

Además, el desarrollo de los distintos ejercicios, me ha ayudado a conocer nuevas API que proporciona Node js y que tienen gran utilidad para el correcto manejo del sistema de ficheros.
