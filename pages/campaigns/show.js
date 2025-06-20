import React from "react";
import {CardGroup, Grid, GridColumn, Button, GridRow} from 'semantic-ui-react'
import { useRouter } from 'next/router';
import Campaign from '../../ethereum/campaign'
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import Link from "next/link";

function CampaignShow(props) {
  console.log(props.address)
  const router = useRouter()


  const items = [{
    header: props.manager,
    meta: 'Address of Manager',
    description: 'The manager created this campaign and can create requests to use money',
    style: {overflowWrap: 'break-word'}
  },
    {
      header: props.minimumContribution,
      meta: 'Minimum Contribution (wei)',
      description: 'You need to contribute at least this much wei to become an approver',
      style: {overflowWrap: 'break-word'}
    },
    {
      header: props.requestsCount,
      meta: 'Number of Requests',
      description: 'A request tries to withdraw money from the contract for a specific purpose',
      style: {overflowWrap: 'break-word'}
    },
    {
      header: props.approversCount,
      meta: 'Number of Contributors',
      description: 'The amount of people who have donated to the campaign',
      style: {overflowWrap: 'break-word'}
    },
    {
      header: web3.utils.fromWei(props.balance, 'ether'),
      meta: 'Campaign Balance (Ethereum)',
      description: 'The balance is how much money this campaign has left to spend',
      style: {overflowWrap: 'break-word'}
    }

  ]

  return (
      <div>

        <Grid>
          <GridRow>
          <GridColumn width={10}>
            <CardGroup items={items}/>
          </GridColumn>

          <GridColumn width={6}>
            <ContributeForm address={props.address}/>
          </GridColumn>

          </GridRow>
          <GridRow>
          <Link href={{
            pathname: "/campaigns/[address]/requests",
            query: {address: props.address}
          }}>
            <Button primary>Requests</Button>
          </Link>
          </GridRow>

        </Grid>


      </div>
  );
}

export default CampaignShow;

CampaignShow.getInitialProps = async(props) => {
  const address = props.query.campaignAddress;
  const campaign = Campaign(address)

  const summary = await campaign.methods.getSummary().call()

  console.log(summary)
  return { address,
      minimumContribution: summary[0].toString(),
      balance: summary[1].toString(),
      requestsCount: summary[2].toString(),
      approversCount: summary[3].toString(),
      manager: summary[4],
    };
}

