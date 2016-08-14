'use strict';
const createLabel = require("../lib/createLabel").createLabel;
let internals = {};
internals.getPrinters = function(request, reply) {
  reply(printer.getPrinters());
};
internals.printPayload = function(request, reply) {
  if (request.payload.mergeData) {
    createLabel({
        mergeData: request.payload.mergeData,
        template: request.payload.template
      })
      .then(function(buffer) {
        //We receive a file buffer which we can write to a file or send to printer
        reply(buffer)
          .type('application/pdf')
          .header('Content-Disposition', 'inline; filename="' + 'labels.pdf"')
          .header('Content-Length', buffer.length);
      }, function(err) {
        reply('An error occured');
      });
  }
};
module.exports.handlers = internals;
