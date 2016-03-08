const Hapi = require("hapi");
const Routes = require('../routes/routes');
const server = new Hapi.Server();
function createServer(port) {
  server.connection({
    host: 'localhost',
    port: port,
    routes: {
      cors: true
    }
  });

  // Add the route
  server.route(Routes);

  return server;
}

module.exports = {
  createServer: createServer
};
