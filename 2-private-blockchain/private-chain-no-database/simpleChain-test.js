/* ===== Testing ===================================
|  - Use looping to test batch addition of Blocks   |
|  - Check blockchain dataset for integrity with    |
|    the hash link between Blocks                   |
|  ================================================*/

let simpleChain = require('./simpleChain.js');

// instantiate blockchain
let blockchain = new simpleChain.Blockchain();

// add 10 blocks to blockchain
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new simpleChain.Block("test data "+i));
}

// Validate blockchain
blockchain.validateChain();

// induce errors by changing data
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}

// validate chain should now fail
blockchain.validateChain();

console.log(inducedErrorBlocks.length+ ' induced block errors with blocks: '+inducedErrorBlocks);
