'use strict';
const Joi = require('joi');
const json2csv = require('json2csv');
const fs = require('fs');
const exec = require('child_process').exec;
const randomstring = require("randomstring");
var printer = require('printer');
let internals = {};
const printer_name = '';
internals.getPrinters = function(request, reply) {
  reply(printer.getPrinters());
};
internals.printPayload = function(request, reply) {
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
        reply('').code(500);
      }
      fs.writeFile(tempFile + '.csv', csv, function(err) {
        if (err) {
          reply('CSV label content could not be created').code(500);
        }
        var child;
        // executes `pwd`
        child = exec("glabels-3-batch labelwithname.glabels --input=" + tempFile + ".csv" + " --output=" + tempFile + ".pdf",
          function(error, stdout, stderr) {
            if (error !== null) {
              reply('Unable to create a printable lable').code(500);
            }
            printer.printFile({filename:tempFile+".pdf",
                printer: request.payload.printer, // printer name, if missing then will print to default printer
                success:function(jobID){
                  removeTempFiles(tempFile);
                  var message = {
                    success: 'Print job sent',
                    jobId: jobID
                  };
                  reply(message);
                },
                error:function(err){
                  var message = {
                    message: 'Print job not created',
                    error:err
                  };
                  reply(message);
                }
              });
          });
      });
    });
  }
};

function removeTempFiles(tempFile) {
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
}
module.exports = [{
  method: 'POST',
  path: '/print_lab_label',
  config: {
    validate: {
      payload: {
        printer :Joi.string(),
        labelData: Joi.required()
      }
    },
    handler: internals.printPayload
  }
}, {
  method: 'GET',
  path: '/printers',
  config: {
    handler: internals.getPrinters
  }
}];
