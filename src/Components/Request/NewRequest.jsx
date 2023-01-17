import React, { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom';
import { Form, Message, Button , Input} from 'semantic-ui-react';
import campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';

export default function NewRequest() {
    let { id } = useParams();
    let [newRequest, setNewRequest] = useState({
        description : '',
        value : 0,
        recipient : ''
    });
    let [loading, setLoading] = useState(false);
    let [errMessage, setErrorMessage] = useState('');
    let [shouldRedirect, setShouldRedirect] = useState(false);

    let onSubmit = async (event)=>{
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        const Campaign = campaign(id);
        const {description, value, recipient} = newRequest;

        try{
            let accounts = await web3.eth.getAccounts();
            await Campaign.methods. createRequest(
                description,
                web3.utils.toWei(value, 'ether'),
                recipient
            )
            .send({
                from : accounts[0]
            });
            setShouldRedirect(true);
        }catch(err){
            console.log(err);
            setErrorMessage(err.message);
        }  

        setLoading(false);
    }
    
    return (
        <div className="container my-3">
            <Link className='my-3' to={`/viewCampaign/${id}/requests`}>
                <Button primary className='my-3'>Back</Button>
            </Link>
            <Form onSubmit={onSubmit} error={!!errMessage}>
                <Form.Field>
                    <label>Description</label>
                    <Input value={newRequest.description} onChange={(event)=>{
                        setNewRequest({...newRequest, description:event.target.value});
                    }}/>
                </Form.Field>

                <Form.Field>
                    <label>Value in Ether</label>
                    <Input value={newRequest.value} onChange={(event)=>{
                        setNewRequest({...newRequest, value:event.target.value});
                    }}/>
                </Form.Field>

                <Form.Field>
                    <label>Recipient</label>
                    <Input value={newRequest.recipient} onChange={(event)=>{
                        setNewRequest({...newRequest, recipient:event.target.value});
                    }}/>
                </Form.Field>
                <Button loading={loading} primary onClick={onSubmit}>Create</Button>
                <Message error header='OOPS!' content={errMessage}/>
                {shouldRedirect && <Navigate replace to={`/viewCampaign/${id}/requests`}/>}
            </Form>
        </div>
    )
}
