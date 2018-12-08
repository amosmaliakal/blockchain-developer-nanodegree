'use strict';

const Hapi = require('hapi');
const simpleChain = require('./simpleChain');
const blockchain = new simpleChain.Blockchain();
const queue = require('./messageQueue');
const bitcoin = require('bitcoinjs-lib'); // v3.x.x
const bitcoinMessage = require('bitcoinjs-message');
const hex2ascii = require('hex2ascii');

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

// Get blocks by address
server.route({
    method: 'GET',
    path: '/stars/address:{address}',
    handler: function (request, reply) {
      return blockchain.getBlocksByAddress(request.params.address);
    }
});

// Get block by hash
server.route({
    method: 'GET',
    path: '/stars/hash:{hash}',
    handler: function (request, reply) {
      return blockchain.getBlockByHash(request.params.hash);
    }
});

// Post block by ID
server.route({
    method:'POST',
    path:'/block',
    handler:function(request,reply) {
        let blockBody = {};
        let star = {};
        let address = request.payload.address;
        let RA = request.payload.star.ra;
        let DEC = request.payload.star.dec;
        let MAG = request.payload.star.mag;
        let CEN = request.payload.star.cen;
        let starStory = request.payload.star.story;

        // Check if Blockchain ID is validated to post a new block
        if (queue.isWhiteList(address)) {
            if (RA != null && DEC != null) {
                blockBody.address = address;
                // TODO: Validate star coordinates
                star.ra = RA;
                star.dec = DEC;
                star.mag = MAG;
                star.cen = CEN;
                // Encode star story to hexidecimal
                star.story = Buffer(starStory).toString('hex');
                blockBody.star = star;
                queue.removeWhiteList(address);
                return blockchain.addBlock(new simpleChain.Block(blockBody));
            } else {
                return {'status':'missing star coordinates','required':'RA, DEC'}
            }
               
            } else {
                return {'status':'Blockchain ID must be verified '+server.info.uri+'/requestValidation'}
            }
    }
});

// Verify message signature
server.route({
    method:'POST',
    path:'/message-signature/validate',
    handler: async function(request,reply) {
        let address = request.payload.address;
        let status = await queue.checkStatus(address);
        let whiteListStatus = queue.isWhiteList(address);
        let signature = request.payload.signature;
        let message = status.message;
        let validation = false;

        if (status === false && whiteListStatus === false) {
            return {'registerStar':false,'status':'Blockchain ID not varified, please request validation '+ server.info.uri +'/requestValidation'}
        } else if(status === false && whiteListStatus === true) {
            return {'registerStar':true,'status':'Blockchain ID verified'}
        } else {
            validation = await bitcoinMessage.verify(message, address, signature);
        }

        if (validation === true && status === !false || validation === true && status.validationWindow>0 ) {
            status.messageSignature = 'valid';
            queue.removeValidation(address);
            queue.addWhiteList(address);
            return {'registerStar':true,'status':status}
        } else {
            status.messageSignature = 'invalid';
            return {'registerStar':false,'status':status}
        }
    }
});

server.route({
    method:'POST',
    path:'/requestValidation',
    handler:function(request,reply) {
        var address = request.payload.address;
        return queue.validateBlockchainID(address);
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
