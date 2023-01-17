import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Table } from 'semantic-ui-react';
import campaign from '../../ethereum/campaign';
import { useEffect } from 'react';
import { useState } from 'react';
import web3 from '../../ethereum/web3';
import checkImg from '../../pictures/check.png'

export default function Requests() {

    let { id } = useParams();
    const Campaign = campaign(id);
    let [requests, setRequests] = useState([]);
    let [approversCount, setApproversCount] = useState(0);
    let [approveLoading, setApproveLoading] = useState(false);
    let [finalizeLoading, setFinalizeLoading] = useState(false);

    useEffect(() => {
        async function fetchData (){
            setApproversCount(await Campaign.methods.approversCount().call());
            const requestCount = await Campaign.methods.getRequestCount().call();
            let getRequest = ()=>{
                let arr = [];
                for(let i=0; i<requestCount; i++){
                    arr.push(Campaign.methods.requests(i).call());
                }
                return arr;
            }
            
            let requestsArr = await Promise.all(getRequest());
            setRequests(requestsArr);

        }
        fetchData();
      }, []);

    let onApprove = async (event, index)=>{
        setApproveLoading(true);
        const accounts = await web3.eth.getAccounts();
        try{
            await Campaign.methods.approveRequest(index).send({
                from : accounts[0]
            });
            window.location.reload(true);
        }catch(err){
            console.log(err);
        }
        setApproveLoading(false);
    }

    let onFinalize = async (event, index)=>{
        setFinalizeLoading(true);
        const accounts = await web3.eth.getAccounts();
        try{
            await Campaign.methods.finalizeRequest(index).send({
                from : accounts[0]
            });
            window.location.reload(true);
        }catch(err){
            console.log(err);
        }
        setFinalizeLoading(false);
    }

    return (
        <div className="container my-3">
            <h2>Requests</h2>
            <Link className='my-3' to={`/viewCampaign/${id}`}>
                <Button primary className='my-3' floated='left'>Back</Button>
            </Link>
            <Link to={`/viewCampaign/${id}/requests/new`}><Button className='my-3' primary floated='right'>Add Request</Button></Link>
            
            <Table>
                <Table.Header style={{fontSize:'1.2rem'}}>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell>Approvals</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header> 
                <Table.Body style={{fontSize:'1.1rem'}}>
                    {requests.map((element, index)=>{
                        return <Table.Row key={index} disabled={element.complete} positive={element.approvalCount>approversCount/2 && element.complete==false} >
                            <Table.Cell>{index+1}</Table.Cell>
                            <Table.Cell>{element.desc}</Table.Cell>
                            <Table.Cell>{web3.utils.fromWei(element.value, 'ether') + ' eth'}</Table.Cell>
                            <Table.Cell>{element.recipient}</Table.Cell>
                            <Table.Cell>{element.approvalCount+'/'+approversCount}</Table.Cell>
                            <Table.Cell>
                                {element.complete ? null : (
                                <Button loading={approveLoading} color='green' basic onClick={(event)=>{onApprove(event, index)}}>
                                    Approve
                                </Button>
                                )}
                            </Table.Cell>
                            <Table.Cell>{element.complete ? <span style={{fontSize:'1.5rem', color:'green'}}>&#10003;</span>:
                                (<Button loading={finalizeLoading} color='teal' basic onClick={(event)=>{onFinalize(event, index)}}>
                                    Finalize
                                </Button>)}
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
                <h4>Found {requests.length} requests</h4>
        </div>
    ) 
}
