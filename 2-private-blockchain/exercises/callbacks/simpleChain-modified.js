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
    getBlockHeightFromLevelDB(function(height) {
      // Block height
      newBlock.height = (height + 1);
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      // previous block hash
      if(height>=0){
        getDataFromLevelDB(height, function(data) {
          newBlock.previousBlockHash = JSON.parse(data).hash;
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          // Store newBlock in LevelDB
          addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());
        });
      } else {
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Store newBlock in LevelDB
        addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());
      }
    });
  }

  // Get block height
    getBlockHeight(){
      getBlockHeightFromLevelDB(function(height) {
        console.log('Height: ' + (height).toString());
      });
    }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      getDataFromLevelDB(blockHeight, function(block) {
        console.log(JSON.parse(block));
      });
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

// Add data to levelDB with key/value pair
function addDataToLevelDB(key, value) {
  db.put(key, value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  });
}

// Get data from levelDB with key
function getDataFromLevelDB(key, callback) {
  db.get(key, function(err, value) {
    if (err) return console.log('Not found!', err);
    callback(value);
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

/*

Testing

skills:  Javascript, private blockchain, persisting blockchain data, and blockchain validation

Student code should be testable within node REPL environment. The project should contain a package.json file for project dependencies.
Project should demonstrate:
		- Persisting blockchain data using LevelDB (level).
		- Adding new blocks to the blockchain
		- Getting blocks from blockchain
		- Get block height from blockchain
		- Validating a single block
		- Validating blockchain (multiple blocks)


- Copy the student project to your local machine.
- Open a new terminal session and navigate to the student project directory.
- Within a terminal session, install project dependencies using 'npm install'.
- Enter node REPL testing environment within your terminal session using 'node'
- In a separate window, open student source code and copy to clipboard
- Navigate back to your terminal session with node REPL and past student code to test

	1. Instantiate blockchain object
		Example: let blockchain = new Blockchain();
	2. Add three new blocks to the blockchain, one at a time.
		Example:
			blockchain.addBlock(new Block('test 1'));
			blockchain.addBlock(new Block('test 2'));
			blockchain.addBlock(new Block('test 3'));
	3. Test Blockchain. Note: The blockchain should pass validation.
		Example: blockchain.validateChain()
	4. Test block 2 validation. Note: The block should pass validation.
		Example: blockchain.validateBlock(2)
	5. Get block two objects and copy to clipboard
	6. Configure a new testBlock object and paste clipboard
		Example: let testBlock =  {
			hash: '7efe1d01a906f7ee4db60af136be15ed6b82b989af74c7b164c6edca15261c5e',
			height: 2,
			body: 'test 2',
			time: '1530817885',
			previousBlockHash: '61fe6c1fecbb85bc35c00c6324b049ffc33d1fd7a2b3d6825a60ac17602f9f55'
		};
	7. Modify testBlock.body
		Example: testBlock.body = 'test 2 - modified';
	8. Add testBlock to levelDB with index key 2 (Block height 2)
		Example: addDataToLevelDB(2, JSON.stringify(testBlock).toString());
	9. Test block validation. Note: the validation should fail
		Example: blockchain.validateBlock(2)
	10. Test Blockchain. Note: The blockchain should fail validation.
		Example: blockchain.validateChain();
	11. Get block height and take note of the response
	12. Close and restart the application to test genesis block persist as block 0.
			Make sure to validate that a new genesis block is not added to the end
			of the chain upon restart of the blockchain using getBlockHeight() function to compare with the previous step.
		Example:
			blockchain = new Blockchain();
			blockchain.getBlockHeight();

		*/
