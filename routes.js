'use strict';
const Joi = require('joi');
const Bluebird = require("bluebird");
const json2csv = Bluebird.promisify(require('json2csv'))
const writeFile = Bluebird.promisify(require('fs').writeFile);
const fs = Bluebird.promisifyAll(require('fs'));
const exec = Bluebird.promisify(require('child_process').exec);
const randomstring = require("randomstring");
const printLabel = require("./util/printLabel").printLabel;
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
    }).then(function(csv) {
      return writeFile(tempFile + '.csv', csv, {}).then(function() {});
    }).then(function(result) {
      return exec("glabels-3-batch labelwithname.glabels --input=" + tempFile + ".csv" + " --output=" + tempFile + ".pdf");
    }).then(function(result) {
      return printLabel(tempFile + '.pdf', request.payload.printer);
    }).then(function(result) {
      removeTempFiles(tempFile);
      reply(result);
    }).catch(function(err) {
      removeTempFiles(tempFile);
      reply('An error occured');
    });
  }
};

function removeTempFiles(tempFile) {
  fs.unlink(tempFile+'.pdf');
  fs.unlink(tempFile+'.csv');
}
module.exports = [{
  method: 'POST',
  path: '/print_lab_label',
  config: {
    validate: {
      payload: {
        printer: Joi.string(),
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
