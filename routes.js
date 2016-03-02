'use strict';
const Joi = require('joi');
const json2csv = require('json2csv');
const fs = require('fs');
const exec = require('child_process').exec;
const randomstring = require("randomstring");
let internals = {};
const printer_name = '';

internals.getProducts = function(request, reply) {
  if (request.payload.labelData) {
    var tempFile = randomstring.generate({
      length: 12,
      charset: 'alphabetic'
    });
    json2csv({
      data: request.payload.labelData,
      hasCSVColumnTitle: false
    }, function(err, csv) {
      if (err) {
        console.log(err);
        reply('').code(500);
      }
      fs.writeFile(tempFile + '.csv', csv, function(err) {
        if (err) {
          console.log('exec error: ' + error);
          reply('CSV label content could not be created').code(500);
        }
        var child;
        // executes `pwd`
        child = exec("glabels-3-batch labelwithname.glabels --input=" + tempFile + ".csv" + " --output=" + tempFile + ".pdf",
          function(error, stdout, stderr) {
            if (error !== null) {
              console.log('exec error: ' + error);
              reply('Unable to create a printable lable').code(500);
            }
            child = exec("lpr " + tempFile + ".pdf", function(error, stdout, stderr) {
              if (error !== null) {
                console.log('exec error: ' + error);
                reply('The the printer may not be ready to accept jobs').code(500);
              }
              fs.unlink(tempFile + ".pdf", function(err) {
                if (err) {
                  return console.error(err);
                }
                console.log("PDF temp file deleted successfully!");
              });
              fs.unlink(tempFile + ".csv", function(err) {
                if (err) {
                  return console.error(err);
                }
                console.log("CSV temp file deleted successfully!");
              });
              reply('done');
            });
          });
      });
    });
  }
};

module.exports = [{
  method: 'POST',
  path: '/print_lab_label',
  config: {
    validate: {
      payload: {
        labelData: Joi.required()
      }
    },
    handler: internals.getProducts
  }
}];
