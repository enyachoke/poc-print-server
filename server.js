'use strict';

const Hapi = require('hapi');

const Routes = require('./routes');
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true
  }
});

// Add the route
server.route(Routes);

// Start the server
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
