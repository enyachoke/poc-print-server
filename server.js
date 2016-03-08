'use strict';
var hapi_server = require('./server/server.js');
var port = 8000;
var server = hapi_server.createServer(port);

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
