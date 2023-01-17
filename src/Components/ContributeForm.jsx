import React, { useState } from 'react'
import {Form, Input, Message, Button} from 'semantic-ui-react';
import campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Navigate} from 'react-router-dom'

export default function ContributeForm(props) {
    let [amount, setAmount] = useState(0);
    let [loading, setLoading] = useState(false);
    let [message, setMessage] = useState('');

    let onSubmit = async (event)=>{
        event.preventDefault();
        setLoading(true);
        setMessage('');
        const Campaign = campaign(props.address);

        try{
            const accounts = await web3.eth.getAccounts();
            await Campaign.methods.contribute().send({
                from : accounts[0],
                value : web3.utils.toWei(amount, 'ether')
            });
            window.location.reload(true);
        }catch(err){
            setMessage(err.message);
        }
        setLoading(false);
    }

    return (
        <div>
            <Form error={!!message}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input label='ether' labelPosition='right' onChange={(event)=>{
                        setAmount(event.target.value);
                    }}/>
                </Form.Field>
                <Button loading={loading} primary onClick={onSubmit}>Contribute</Button>
                <Message error header="OOPS!" content={message}/>
            </Form>
        </div>
    )
}
