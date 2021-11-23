import React,{ Component } from 'react'
import Layout from '../../components/Layout'
import { Card, Grid, Button } from 'semantic-ui-react'
import campaignInstance from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'
import ContributeForm from '../../components/ContributeForm'
import { Link } from '../../routes'

class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = campaignInstance(props.query.address)

        const summary = await campaign.methods.getSummary().call()

        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
    }

    renderCards() {
        const {
            manager,
            balance,
            requestsCount,
            approversCount,
            minimumContribution
        } = this.props

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaign and can create request to withdraw money',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute atleast this much wei to become a contributor'
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from a contract. A request must be approved by contributers'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: "Number of people who have already donated to the campaign"
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance(ether)',
                description: 'The money left in the campaign to spend'
            }
        ]

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Showing Campaign</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}> 
                            {this.renderCards()}
                            
                        </Grid.Column>  
                    
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>   

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>                               
            </Layout>            
        )
    }
}

export default CampaignShow