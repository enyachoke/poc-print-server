'use strict';
const Joi = require('joi');
const handlers = require("../lib/handlers").handlers;
module.exports = [{
  method: 'POST',
  path: '/print_lab_label',
  config: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        template: Joi.string(),
        printer: Joi.string(),
        mergeData: Joi.array().items(Joi.object({}))
      }
    },
    handler: handlers.printPayload,
    description: 'Print label',
    notes: 'This method takes a json payload with printer to be used,template name and an array of merge Data',
    tags: ['api']
  }
}, {
  method: 'GET',
  path: '/printers',
  config: {
    handler: handlers.getPrinters,
    description: 'Get Printers',
    notes: 'Returns the list of printers available to the local system',
    tags: ['api']
  }
}];
