# Blockchain Smart Contracts

Advance your Blockchain skillset to the second generation of Blockchain services with smart contracts utilizing the Ethereum network.

# Lesson 10 

- Explain what is a Smart Contract
     - I think this is a pretty good explanation how to explain what smart contract / EVM is that we can use as inspiration
     - https://blog.zeppelin.solutions/ethereum-in-depth-part-1-968981e6f833  
- How can we make a DApp that verifies notarizations (signed documents) 
     - How to create a signature on ethereum
            - https://medium.com/@angellopozo/ethereum-signing-and-validating-13a2d7cb0ee3 and https://hackernoon.com/a-closer-look-at-ethereum-signatures-5784c14abecc 
       - Use `web3.eth.sign(address, message)`
       - Explain that this signing happens using your private key
       - Set the message as some representation of a hash of a document 
       - Briefly go over what a hash of a document means 
       - *Coding part* :Make a simple boilerplate web page to show how to sign a message and commit that to an ethereum smart contract using https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign + https://etherscan.io/verifySig 
     - How to verify a signature in a smart contract
       - *Coding part* Explain ecrecover (Solidity’s native contract method to return back the address of the signature given the hashed message) 
       - https://github.com/sogoiii/ecrecover-example/blob/master/contracts/Verifier.sol 

# Lesson 11

- Okay, we have a hash of a document as a message, where is the actual document stored? 
     - *Coding part* Set-up a backend with a database. Have the front-end upload a document to the backend, the backend will provide a hash of the document that was just uploaded, and save a mapping of document hash -> document for later retrieval.The front-end would take that hash and sign like from Lesson 10
          - Pro: You can store sensitive documents on a private db, and only provide a hash of the document for signature purposes without ever revealing the sensitive document
          - Con: It’s not a fully decentralized solution (you have to maintain your private db) 
          - Alright, what if I  wanted to make the storage part fully decentralized? There are many projects out there for decentralized data storage: IPFS, Sia, Storj, Swarm (not launched, with the overall community losing hope it’ll ever launch), Dat, and maybe some others
          - We’ll focus on IPFS as it is currently the most commonly chosen one by the Ethereum community 
          - Explain how it works, where the project stands now, where it’s going (Filecoin)
- IPFS: 
     - Intro on the tech behind it 
     - How to set it up
     - How to use it (show the webgui and how to interact with it through the webgui or command line)
     - How to use it in the DApp we've built with the database from previous steps
          - *Coding part* Build on top of the same coding project from previous steps, replace the database part with IPFS
          - Instead of uploading to a database, make a new endpoint, and upload to IPFS instead. The output would be the same as using a database (a hash) back to the front end 
