/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = '',
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ''
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
		addDataToLevelDB(0, JSON.stringify(this.genesisBlock()).toString());
  }

	// Genesis Block
  genesisBlock(){
  	let block = {
  		hash: '',
  		height: 0,
  		body: 'First block in the chain - Genesis block',
  		time: '1530311457',
  		previousBlockHash: ''
  		};
  	block.hash = SHA256(JSON.stringify(block)).toString();
	return block;
	}

  // Add new block
  addBlock(newBlock){
    return new Promise((resolve, reject) => getBlockHeightFromLevelDB( function(height) {
      // Block height
      newBlock.height = (height + 1);
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      // previous block hash
      if(height>=0){
         getDataFromLevelDB(height, function(error, data) {
          newBlock.previousBlockHash = JSON.parse(data).hash;
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          // Store newBlock in LevelDB
					resolve(newBlock);
        });
      } else {
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Store newBlock in LevelDB
				resolve(newBlock);
      }
    })).then(function(data){
			addDataToLevelDB(newBlock.height, JSON.stringify(data).toString());
			console.log('test');
			return data
		}
		);
  }

  // Get block height
    getBlockHeight(){
      getBlockHeightFromLevelDB(function(height) {
        console.log('Height: ' + (height).toString());
      });
    }

    // get block
    getBlock(blockHeight){
			// return promise
			return new Promise((resolve, reject) => getDataFromLevelDB(blockHeight, function(error, value) {
				if (error) {
		         console.log(error);
						 resolve('Block not found');
		       } else {
							console.log('block', blockHeight, 'retrieved from database');
							resolve(JSON.parse(value));
					}
				}
				));
    }


    // validate block
    validateBlock(blockHeight){
      validateBlockFromLevelDB(blockHeight, function(isValid) {
        if(isValid) {
          console.log('Block validated');
        }
      });
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      let chain = [];
      let i = 0;
      db.createReadStream().on('data', function (data) {
        // validate block
        validateBlockFromLevelDB(i, function(value) {
          if(!value) {
            errorLog.push(i);
          }
        });
        chain.push(data.value);
        i++;
      })
      .on('error', function (err) {
        console.log('Oh my!', err);
      })
      .on('close', function () {
        for (var i = 0; i < chain.length-1; i++) {
          // compare blocks hash link
          let blockHash = JSON.parse(chain[i]).hash;
          let previousHash = JSON.parse(chain[i+1]).previousBlockHash;
          if (blockHash!==previousHash) {
            errorLog.push(i);
          }
        }
        if (errorLog.length>0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: '+errorLog);
        } else {
          console.log('No errors detected');
        }
      });
    }
}

// sleep delay
function sleep(duration) {
	return new Promise(function(resolve, reject) {
		setTimeout(()=> { resolve(0) }, duration);
	})
}

// Add data to levelDB with key/value pair
function addDataToLevelDB(key, value) {
  db.put(key, value, function(err) {
    if (err) {
			return console.log('Block ' + key + ' submission failed', err)
		} else {
    	return console.log('Block ' + key + ' created\n'+value)
    }
  });
}


// Get data from levelDB with key
function getDataFromLevelDB(key, callback) {
  db.get(key, function(err, value) {
    callback(err, value);
  });
}
// Validate block in levelDB with key
function validateBlockFromLevelDB(key, callback) {
  getDataFromLevelDB(key, function(value) {
    // get block object
    let block = JSON.parse(value);
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
      callback(true);
    } else {
      callback(false);
      console.log('Block #'+key+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
    }
  });
}

// Get block height from leveDB
function getBlockHeightFromLevelDB(callback) {
  let i = 0;
  db.createReadStream().on('data', function (data) {
      i++;
    })
    .on('error', function (err) {
      console.log('Oh my!', err);
    })
    .on('close', function () {
      callback(i-1);
    });
}

module.exports = {
    Blockchain : Blockchain,
		Block : Block
}
