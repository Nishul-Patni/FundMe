import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import campaign from '../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import { useEffect } from 'react';
import Web3 from 'web3';
import ContributeForm from './ContributeForm';

export default function ViewCampaign(props) {
    let [summary, setSummary] = useState([]);
    let { id } = useParams();
    const Campaign = campaign(id);
    
    useEffect(() => {
        async function fetchData (){
          setSummary(await Campaign.methods.getSummary().call());
        }
        fetchData();
    }, []);

    function renderSummary(){
        let minimumContribution, balance, requestCount, approverCount, manager;
        minimumContribution = summary["0"];
        balance = summary["1"];
        requestCount = summary["2"];
        approverCount = summary["3"];
        manager = summary["4"];
        const items =[
            {
                header:manager,
                meta : "Manager Address",
                description : "Manager can create request for funds"
            },
            {
                header : minimumContribution +" wei",
                meta : "Minimum Contribution wei",
                description : "You need to contribute at least this much wei to become an approver",
            },
            {
                header : requestCount,
                meta : 'Number of requests',
                description : 'A requet trues to withdraw money from the contributer'
            },
            {
                header : approverCount,
                meta : 'Number of approvers',
                description : 'Number of people who already doanated to the campaign'
            },
            {
                header : balance + " wei",
                meta : 'Campaign balance (wei)',
                description : 'The balance is how much money this campaign has collected'
            }
        ]
        return <Card.Group items={items} />;
      }
    

    return (
        <div className="my-3">
            <Link className='my-3' to={`/`}>
                <Button primary className='my-3'>Back</Button>
            </Link>
            <Grid>
                <Grid.Column width={11}>
                    {renderSummary()} 
                    <Link to={`/viewCampaign/${id}/requests`}>
                        <Button className="my-3" primary>View Requests</Button>
                    </Link>
                </Grid.Column>
                <Grid.Column width={5}>
                    <ContributeForm address={id}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}
