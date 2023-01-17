import CampaignFactory from './build/CampaignFactory.json';
import web3 from './web3';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xbF178837141c2aA1b47E487D15ce9Dc715e3500f'
);

export default instance;