import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xdFEF350809D84A733afDAfE40109405e47fb5D2b'
);

export default instance;
