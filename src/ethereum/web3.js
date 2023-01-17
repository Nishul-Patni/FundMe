import Web3 from 'web3';

let web3;

async function main(){
    if(window!=='undefined' && window.ethereum !== 'undefined'){
        web3 = new Web3(window.ethereum);
        try{
            await window.ethereum.request({method : "eth_requestAccounts"});
        }catch(err){
            console.log(err);
        }
    }else{
        let provider = new Web3.providers.HttpProvider(
            "https://goerli.infura.io/v3/7a6d6992b305476cb33202a9a3e8d020"
        );
        web3 = new Web3(provider);
    }
}

main();

export default web3; 