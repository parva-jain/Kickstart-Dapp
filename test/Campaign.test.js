const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async() => {
    accounts = await web3.eth.getAccounts()

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data:compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' })

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    })

    const addressArray = await factory.methods.getDeployedCampaigns().call()
    campaignAddress = addressArray[0]
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign ', () => {
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks the caller as campaign manager', async() => {
        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[0], manager)
    })

    it('allows anyone to contribute and mark as approvers', async() => {
        await campaign.methods.contribute().send({
            value:'200',
            from: accounts[1],
            gas: '1000000'
        })

        const isContributor = campaign.methods.approvers(accounts[1]).call()
        assert(isContributor)
    })

    it('requires a minimum contribution', async() => {
        try {
            await campaign.methods.contribute().send({
                value: "2",
                from: accounts[1],
                gas: '1000000'
            })

            assert(false)
        } catch(err) {
            assert(err)
        }
    })

    it('allows a manager to make payment request', async() => {
        await campaign.methods
            .createRequest('buying batteries', '10000', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })
        
        const request = await campaign.methods.requests(0).call()
        assert.equal('buying batteries', request.description)
    })

    it('processes requests', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether'),
            gas: '1000000'
        })

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1])
        balance = await web3.utils.fromWei(balance, 'ether')
        balance = parseFloat(balance)
        
        assert(balance > 104)
    })
})

