/* eslint-disable no-unused-vars */
import {spawn} from 'child_process';

class CatGrepCommand {
  constructor() {
    this.run();
  }
  private run() {
    const catGrep = spawn('cat', ['src/Files/test.txt', '|', 'grep', 'Hola']);
    catGrep.stdout.pipe(process.stdout); // Hay que tener en cuenta que el stdout sirve para leer el contenido del fichero, stdin, sirve para escribir
    let counter: number = 0;
    let catGrepAuxiliary = '';
    catGrep.stdout.on('data', (piece) => {
      catGrepAuxiliary = piece.toString();
    });
    catGrep.on('close', () => {
      const result = catGrepAuxiliary.split(/\s+/);
      result.forEach((item) => {
        if (item === 'Hola') {
          counter++;
        }
      });
      console.log(`  The number of coincidencis is ${counter}`);
    });
  }
}

const test = new CatGrepCommand();
