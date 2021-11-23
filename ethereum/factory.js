import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0x00582078C253DF4E5F06Ab1Ecd52617e7Cfb62F4"
)

export default instance