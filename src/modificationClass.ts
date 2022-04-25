import {spawn} from 'child_process';
import {watchFile} from 'fs';

/**
 * This class makes the cut command
 */
export class CutCommand {
  /**
   * This is the constructor of the class
   */
  constructor() {
    this.run();
  }
  /**
   * This function makes the cut command
   */
  private run(): void {
    watchFile('src/ModificationFiles/example.csv', (curr, prev) => {
      console.clear();
      console.log(`File size was ${prev.size} bytes before it was modified`);
      console.log(`Now file size is ${curr.size} bytes`);

      // const cat = spawn('cat', ['-n', 'src/ModificationFiles/example.csv']);
      // cat.stdout.pipe(process.stdout);
      const cut = spawn('cut', ['-d', ',', '-f', '1', 'src/ModificationFiles/example.csv']);

      let cutOutput = '';
      cut.stdout.on('data', (piece) => {
        cutOutput += piece;
        console.log(cutOutput);
      });

      cut.on('close', () => {
        const cutOutputAsArray = cutOutput.split(/, \n|/);
        cutOutputAsArray.forEach((item) => {
          console.log(item);
        });
      });
    });
    //   const wc = spawn('wc', ['src/ModificationFiles/example.csv']);

    //   let wcOutput = '';
    //   wc.stdout.on('data', (piece) => wcOutput += piece);

    //   wc.on('close', () => {
    //     const wcOutputAsArray = wcOutput.split(/\s+/);
    //     console.log(`File helloworld.txt has ${wcOutputAsArray[1]} lines`);
    //     console.log(`File helloworld.txt has ${wcOutputAsArray[2]} words`);
    //     console.log(`File helloworld.txt has ${wcOutputAsArray[3]} characters`);
    //   });
    // });
  }
}
