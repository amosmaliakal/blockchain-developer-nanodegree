'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = Hapi.server({
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    },
    port: 5000
});

const start = async () => {

    await server.register(require('inert'));

    server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
          path: '.',
          redirectToSlash: true,
          index: true,
        }
    }
});
    await server.start();

    console.log('Server running at:', server.info.uri);
};

start();
