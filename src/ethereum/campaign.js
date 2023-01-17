import web3 from "./web3";
import Campaing from "./build/Campaign.json";

export default (address)=>{
    return new web3.eth.Contract(
        JSON.parse(Campaing.interface),
        address
    )
}