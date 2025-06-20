import React, {useState} from 'react'
import {Form, FormField, Button, Message, Input} from "semantic-ui-react";
import Campaign from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";
import Link from "next/link";
import Layout from "../../../../components/Layout";
import { useRouter } from 'next/router'

RequestNew.getInitialProps = (props)  => {
    const address = props.query.address

    return {address}
}

function RequestNew(props){
    const router = useRouter()
    const [value, setValue] = useState('')
    const [description, setDescription] = useState('')
    const [recipient, setRecipient] = useState('')
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async event => {
        event.preventDefault()

        const campaign = Campaign(props.address)

        setLoading(true)
        setErrorMessage('')

        try{
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            ).send({from: accounts[0]})

            router.push(`/campaigns/${props.address}/requests`)
        }catch (err){
            setErrorMessage(err.message)
        }
        setLoading(false)

    }

    return(<div>

        <h3>Create request</h3>
        <Form onSubmit={onSubmit} error={!!errorMessage}>
            <FormField>
                <label>Description</label>
                <Input
                    value={description}
                    onChange={event => {setDescription(event.target.value)}}
                />

            </FormField>
            <FormField>
                <label>Value in Ether</label>
                <Input
                    value={value}
                    onChange={event => {setValue(event.target.value)}}
                />
            </FormField>
            <FormField>
                <label>Recipient</label>
                <Input
                    value={recipient}
                    onChange={event => {setRecipient(event.target.value)}}
                />
            </FormField>
            <Message error header="Oops!" content={errorMessage} />
            <Button primary loading={loading}>Create</Button>
        </Form>

    </div>)
}

export default RequestNew