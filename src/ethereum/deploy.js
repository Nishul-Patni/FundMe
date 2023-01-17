const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    //mnemonic for unlocking account
    "convince neglect trim retreat merge submit barrel void science cloud try modify",
    // link to connect to the network
    "https://goerli.infura.io/v3/7a6d6992b305476cb33202a9a3e8d020"
);

const web3 = new Web3(provider);

let accounts;

const deploy = async () =>{
    accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account ", accounts[0]);

    let result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data:'0x'+compiledFactory.bytecode})
    .send({gas:"1000000", from: accounts[0]});
    
    console.log("Contract Deployed to ", result.options.address);
};


deploy();
