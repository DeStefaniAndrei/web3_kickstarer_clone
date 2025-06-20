import React from "react";
import { Card, Button } from "semantic-ui-react";
import Link from "next/link";
import factory from "../ethereum/factory";

CampaignIndex.getInitialProps = async () => {
    console.log("InitialProps running")
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log("Rendering campaigns:", campaigns);
    return { campaigns };
};

function CampaignIndex({ campaigns }) {

  const items = campaigns.map((campaignAddress) => {
    return {
      header: campaignAddress,
      description: (
          <Link href={{ pathname: '/campaigns/show', query: { campaignAddress } }}>
              View campaign
          </Link>
      ),
      fluid: true,
    };
  });

  return (
        <div>
          <h3>Open Campaigns</h3>
          <Link href="/campaigns/new">
              <Button floated="right" content="Create Campaign" icon="add circle" primary />
          </Link>
          <Card.Group items={items} />
        </div>
  );
}

export default CampaignIndex;
