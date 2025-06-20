import React, {useState} from 'react';
import {Button, Form, FormField, Input, Message} from 'semantic-ui-react'
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import Router from "next/router";


function ContributeForm(props) {
    const [value, setValue] = useState("")
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(props.address)
        setLoading(true)
        setErrorMessage('')


        try{
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            })

            Router.reload();
        }catch (err){
            setErrorMessage(err.message)
        }

        setValue('')
        setLoading(false)



    }

    return (
        <div>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
            <FormField>
                <label>Amount to Contribute</label>
                <Input
                    value = {value}
                    onChange={(event) => {setValue(event.target.value)}}
                    label="ethereum"
                    labelPosition="right"
                />
            </FormField>

            <Message error header="Oops!" content={errorMessage} />
            <Button primary loading={loading}>
                Contribute!
            </Button>
            </Form>
        </div>
    );
}

export default ContributeForm