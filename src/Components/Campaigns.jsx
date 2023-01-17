import React, { useState } from 'react'
import { useEffect } from 'react';
import CampaignFactory from '../ethereum/factory';
import {Card} from 'semantic-ui-react';
import {Button} from 'semantic-ui-react';
import { Link, Navigate } from 'react-router-dom';
import Spinner from './Spinner';

export default function Campaigns() {
  let [campaigns, setCampaigns] = useState([]);
  let [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    async function fetchData (){
      setCampaigns(await CampaignFactory.methods.getDeployedCampaigns().call());
    }
    fetchData();
  }, []);
  
  function renderCampaigns(){
    const items = campaigns.map(address =>{
      return {
        header : address,
        description : <Link to={`/viewCampaign/${address}`}>View Campaign</Link>,
        fluid : true
      }
    })
    return <Card.Group items={items} />;
  }

  return (
    <div>
      <h2 className='my-3'>Open Campaigns</h2>
      <Button
        floated='right'
        content = "Create Campaign"
        icon = "add circle"
        primary = {true}
        onClick={()=>{
          setShouldRedirect(true);
        }}
      />
      {renderCampaigns()}
      {shouldRedirect && <Navigate replace to='/NewCampaign'/>}
    </div>
  )
}
