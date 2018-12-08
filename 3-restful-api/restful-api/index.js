'use strict';

const Hapi=require('hapi');
const simpleChain = require('./simpleChain');
const blockchain = new simpleChain.Blockchain();

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});


// Get block 
server.route({
    method: 'GET',
    path: '/block/{key}',
    handler: function (request, reply) {
      return blockchain.getBlock(request.params.key);
    }
});

// Post block by ID
server.route({
    method:'POST',
    path:'/block',
    handler:function(request,reply) {
        let blockBody = request.payload.body;
        return blockchain.addBlock(new simpleChain.Block(blockBody));
    }
});


// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
