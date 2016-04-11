const Hapi = require("hapi");
const Routes = require('../routes/routes');
const https = require('https');
const fs = require('fs');
const server = new Hapi.Server();
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const options = {
  info: {
    'title': 'POC print server api documention',
    'version': Pack.version,
  }
};
var tls = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  requestCert: false,
  rejectUnauthorized: false
};
function createServer(port) {
  server.connection({
    host: 'localhost',
    port: port,
    routes: {
      cors: true
    },
    tls: tls
  });
  server.register([
      Inert,
      Vision,
      {
          'register': HapiSwagger,
          'options': options
      }]);
  // Add the route
  server.route(Routes);

  return server;
}

module.exports = {
  createServer: createServer
};
