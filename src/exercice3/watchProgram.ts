/* eslint-disable comma-dangle */
// Usar el método watch()
// Los cambios deben de ser controlados en el directorio
// Indicar el tipo de cambio que se ha producido
// Contestar a las últimas preguntas

import * as fs from 'fs';

console.log('accede');
fs.watch(`src/exercice3/notes/Samuel/newNote.json`, {persistent: true}, (eventType) => {
  if (eventType === 'change') {
    console.log('Modificado');
  }
});


// watcher.addListener('change', (eventType, filename) => {
//   console.log(eventType);
//   console.log(filename);
// });

// watcher
//     .on('add', (path) => console.log(`File ${path} has been added`))
//     .on('addDir', (path) => console.log(`Directory ${path} has been added`));
