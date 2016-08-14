const Hapi = require("hapi");
const Routes = require('../routes/routes');
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

function createServer(port) {
  server.connection({
    host: 'localhost',
    port: port,
    routes: {
      cors: true
    }
  });
  server.register([
    Inert,
    Vision, {
      'register': HapiSwagger,
      'options': options
    }, {
      register: require('hapi-router'),
      options: {
        routes: 'routes/**/*.js' // uses glob to include files
      }
    }
  ]);
  // Add the route
  //  server.route(Routes);

  return server;
}

module.exports = {
  createServer: createServer
};
