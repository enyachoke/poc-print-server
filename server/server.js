const Hapi = require("hapi");
const Routes = require('../routes/routes');
const https = require('https');
const fs = require('fs');
const server = new Hapi.Server();
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const config = require('../conf/config');
const tls = require('tls');
const options = {
  info: {
    'title': 'POC print server api documention',
    'version': Pack.version,
  }
};
var tls_config = false;
if (config.tls) {
  tls_config = tls.createServer({
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
  });
}

function createServer(port) {
  server.connection({
    host: config.host,
    port: config.port,
    routes: {
      cors: true
    },
    tls: tls_config
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
server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
module.exports = {
  createServer: createServer
};
