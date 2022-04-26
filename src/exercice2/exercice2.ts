/* eslint-disable no-unused-vars */
import {spawn} from 'child_process';
import yargs from 'yargs';
import chalk from 'chalk';
import * as fs from 'fs';

class CatGrepCommand {
  constructor(private fileRoute: string, private word: string, private method: number) {
    if (this.method === 1) {
      this.firstMethod();
    } else if (this.method === 2) {
      this.secondMethod();
    } else {
      console.log(chalk.red('The selected method does not exists'));
    }
  }
  private firstMethod() { // Este es el método con el pipe
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

yargs.command({
  command: 'catGrepOption',
  describe: 'This command counts the number of coincidencis of a specific string in a specific file',
  builder: {
    file: {
      describe: 'File name',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'To comprobe the coincidences',
      demandOption: true,
      type: 'string',
    },
    method: {
      describe: 'Selects the method that is gonna to use',
      demandOption: true,
      type: 'number',
    },
  },
  handler(argv) {
    if ((typeof argv.file === 'string') &&
      (typeof argv.word === 'string') &&
        (typeof argv.method === 'number')) {
      if (fs.existsSync(argv.file) === true) {
        const firstVersion = new CatGrepCommand(argv.file, argv.word, argv.method);
      } else {
        console.log(chalk.red('The file that is triying to use does not exist'));
      }
    }
  },
});

yargs.parse();
