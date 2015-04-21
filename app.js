global.rekuire = require('rekuire');

var database = rekuire('database/database');

database.getTrainData(function (err, data) {
   if(!err){

       console.log("Primerni: " + data.primerni.join(", ") + "\nNeprimerni: " + data.neprimerni.join(", "));
   }
});