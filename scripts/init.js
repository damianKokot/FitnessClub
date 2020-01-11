const process = require('child_process');
const fs = require('fs');
const Path = require('path');
const config = require('../config');

initialise(() => {
   getFile('create_tables.sql', () => {
      getFile('users/indexes.sql', () => {
         getFile('users/mailCheck.sql', () => {
            getFile('users/phoneCheck.sql', () => {
               getFile('classes/triggers.sql', () => {
                  getFile('classes/checkReservationPossibility.sql', () => {
                     getFile('classes/reservation.sql', () => {
                        getFile('classes/procedures.sql', () => {
                           getFile('simple_data.sql', () => {
                              console.log('Success');
                           })
                        })
                     })
                  })
               })
            })
         })
      })
   })
});


function initialise(next) {
   console.log("Initialising...")
   process.exec(`mysql --user=root --password=${config.db_password} -e "CREATE DATABASE IF NOT EXISTS FitnessClub;"`, (err) => {
      if(err) {
         console.log(err);
         return;
      }
      next();
   });
}

function getFile(fileName, next) {
   const path = Path.join(__dirname, fileName);
   process.exec(`mysql --user=root --password=${config.db_password} FitnessClub < ${path}`, (err, stdout, stderr) => {
      if (err) {
         console.log(err);
      }

      console.log(`path: ${path}`);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      next();
   });
}