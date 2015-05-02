global.rekuire = require('rekuire');


var database = rekuire('database/database'),
    klasifikacija = rekuire('klasifikacija');


database.getTrainData(function (err, data) {
    if (!err) {
        var F1 = klasifikacija.klasificiraj(data.train.primerni, data.train.neprimerni, data.test).F1_Score();
        console.log("F1 je " + F1);
    }
});


/*

 var json2csv = require('json2csv'),
 fs = require('fs');
 database.export(function (err, data) {
 if (!err) {

 var json = JSON.stringify(data);
 fs.writeFile("db-export.json", data, function (err) {
 if (err) {
 return console.log(err);
 }

 console.log("The JSON file was saved!");
 });

 json2csv({data: data, fields: ['id', 'text', 'type']}, function (err, csv) {
 if (!err) {

 fs.writeFile("db-export.csv", csv, function (err) {
 if (err) {
 return console.log(err);
 }

 console.log("The CSV file was saved!");
 });
 }

 });
 }
 });
 */