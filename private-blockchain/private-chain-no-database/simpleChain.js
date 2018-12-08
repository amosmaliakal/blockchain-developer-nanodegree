
/* ===== SHA256 with Crypto-js ===================================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js      |
|  =============================================================*/

const SHA256 = require('crypto-js/sha256');

/* ===== Block Class ===================================
|  Class with a constructor for block data model       |
|  ====================================================*/

class Block {
  constructor(data){
    this.height = '';
    this.timeStamp = '';
    this.data = data;
    this.previousHash = '0x';
    this.hash = '';
  }
}

/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain{
    constructor(){
      // new chain array
      this.chain = [];
      // add first genesis block
      this.addBlock(this.createGenesisBlock());
  }

  createGenesisBlock(){
    return new Block("First block in the chain - Genesis block");
  }

  // getLatest block method
  getLatestBlock(){
    return this.chain[this.chain.length -1];
  }

  // addBlock method
  addBlock(newBlock){
    // block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.timeStamp = new Date().getTime().toString().slice(0,-3);
    if (this.chain.length>0) {
      // previous block hash
      newBlock.previousHash = this.getLatestBlock().hash;
    }
    // SHA256 requires a string of data
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    console.log(JSON.stringify(newBlock));
    // add block to chain
    this.chain.push(newBlock);
  }

  //get block
  getBlock(blockHeight){
    // clone object versus refercing existing object
    return JSON.parse(JSON.stringify(this.chain[blockHeight]));
  }

  //validate block
  validateBlock(blockHeight){
    // get block object
    let block = this.getBlock(blockHeight);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        return true;
      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

 // Validate Blockchain
  validateChain(){
    let errorLog = [];
    for (var i = 0; i < this.chain.length-1; i++) {
      // validate block
      if (!this.validateBlock(i))errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.chain[i].hash;
      let nextBlockPreviousHash = this.chain[i+1].previousHash;
      if (blockHash!==nextBlockPreviousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

// ===== Export Classes ==============

module.exports.Block = Block;
module.exports.Blockchain = Blockchain;
