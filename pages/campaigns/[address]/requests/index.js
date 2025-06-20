import React from "react";
import Layout from "../../../../components/Layout";
import Link from 'next/link'
import {Button, Tab, Table} from 'semantic-ui-react'
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";




function RequestIndex(props){

    const {Header, Row, HeaderCell, Body} = Table;

    function renderRow() {
        return props.requests.map((request, index) => {
            return <RequestRow key={index} id={index} request={request} address={props.address} approversCount={props.approversCount} />
        })
    }

    return (<div>
        <Link href={{
            pathname: "/campaigns/[address]/requests/new",
            query: {address: props.address}
        }}>
            <Button primary floated="right" style={{ marginBottom: 10 }}>Create Request</Button>
        </Link>
        <Table>
            <Header>
                <Row>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Description</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Recipient</HeaderCell>
                    <HeaderCell>Approval Count</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalize</HeaderCell>
                </Row>
            </Header>
            <Body>
                {renderRow()}
            </Body>
        </Table>
        <div>Found {props.requestCount} requests</div>
    </div>)
}

RequestIndex.getInitialProps = async (props) =>{
    const address = props.query.address
    const campaign = Campaign(address)
    const requestCount = await campaign.methods.getRequestCount().call()
    const approversCount = await campaign.methods.approversCount().call()



    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return campaign.methods.requests(index).call()
        })
    )

    const serializedRequests = requests.map(request => ({
        description: request.description,
        value: request.value.toString(),
        recipient: request.recipient,
        complete: request.complete,
        approvalCount: request.approvalCount.toString()
    }));

    return {
        address,
        requests: serializedRequests,
        requestCount: requestCount.toString(),
        approversCount: approversCount.toString()
    };

}

export default RequestIndex