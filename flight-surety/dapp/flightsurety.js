
require.config({
    paths : {
        json: '../node_modules/requirejs-plugins/src/json',
        text: '../node_modules/requirejs-plugins/lib/text'
    }
});

requirejs(['../node_modules/bignumber.js/bignumber.min.js', 'json!../build/contracts/FlightSurety.json'], function (BigNumber, contract) {

    let FlightSurety = null;
    let weiMultiple = (new BigNumber(10)).pow(18); // Used for ETH payment calculations

    let configs = {

        localhost: {
            url: 'http://localhost:8545',
            address: '0x82d50ad3c1091866e258fd0f1a7cc9674609d254'
        },
        ropsten: {
            url: 'https://ropsten.infura.io/hoaFrziApKtGNChupjGp',
            address: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'
        },
        mainnet: {
            url: '',
            address: ''
        }
    }

    // Load contract Application Binary Interface  
    initializeWeb3(contract.abi, configs.localhost);


    /** Initializes web3 and calls the FlightSurety contract to get status
     * 
     * @param {json} abi      FlightSurety contract ABI
     * @param {json} config   dApp configuration information
     */ 
    function initializeWeb3(abi, config) {

        let web3 = new Web3(new Web3.providers.HttpProvider(configs.localhost.url));
        web3.eth.defaultAccount = web3.eth.accounts[0];
        FlightSurety = web3.eth.contract(abi).at(config.address);

        let status = FlightSurety.isOperational.call();
        console.info(`FlightSurety Smart Contract operating status is ${status ? 'Operational' : 'Not Operational'}`);
        
        let filter = web3.eth.filter('latest');
        filter.watch(function (error, result) {
            var block = web3.eth.getBlock(result, true);
            console.log('block #' + block.number);
            console.dir(block.transactions);
        });
    }
});













