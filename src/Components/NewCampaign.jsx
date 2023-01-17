import React, { useState } from 'react';
import { Form, Button, Input, Message} from 'semantic-ui-react';
import CampaignFactory from '../ethereum/factory';
import web3 from '../ethereum/web3';
import { Navigate } from 'react-router-dom';

export default function NewCampaign() {
  let style = 'my-3';
  let [minimumContribution, setMinimumContribution] = useState(0);
  let [errorMessage, setErrorMessage] = useState('');
  let [loading, setLoading] = useState(false);
  let [shouldRedirect, setShouldRedirect] = useState(false);

  let handleMinContribution = (event)=>{
    setMinimumContribution(event.target.value);
  }
  
  let onSubmit = async (event) =>{
    event.preventDefault();
    console.log(1);
    setLoading(true);
    setErrorMessage('');
    try{
      let accounts = await web3.eth.getAccounts();
      await CampaignFactory.methods.createCampaign(minimumContribution)
      .send(
        {
          from : accounts[0]  
        }
        );
        
      }catch(err){
        setErrorMessage(err.message);
      }
      setLoading(false);
      setShouldRedirect(true);
  }
  
  return (
    <div className='container my-3'>
      <h2>Create A New Campaign</h2>
      <Form error={!!errorMessage}>
        
        <Form.Field onSubmit={onSubmit}>
          <label style={{'font-size':'1.2rem'}} className={style} >Minimum Contribution</label>
          <Input  className={style} label='wei' labelPosition='right' value={minimumContribution} onChange={handleMinContribution}/>
          <Button loading={loading} className={style} primary onClick={onSubmit}>Create</Button>
          <Message error header="OOPS!" content={errorMessage}/>
        </Form.Field>
        {shouldRedirect && <Navigate replace to='/'/>}
      </Form> 
    </div>
  )
}
