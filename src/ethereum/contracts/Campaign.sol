pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public{
        address newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request{
        string desc;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    uint public approversCount; 
    mapping(address=>bool) public approvers;
    Request[] public requests;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint _minimumContribution, address creator) public{
        manager = creator;
        minimumContribution = _minimumContribution;
    }

    function contribute() public payable{
        require(msg.value>minimumContribution);
        if(approvers[msg.sender]==false){
            approversCount++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(string _desc, uint _value, address _recipient) public restricted{
        Request memory newRequest = Request({
                desc :_desc,
                value :_value,
                recipient :_recipient,
                complete : false,
                approvalCount : 0
            });
        requests.push(newRequest);
    }

    function approveRequest(uint index) public{    
        Request storage req = requests[index];
        require(approvers[msg.sender]);
        require(!req.approvals[msg.sender]);
        req.approvalCount++;
        req.approvals[msg.sender] = true;
    }
 
    function finalizeRequest(uint index) public restricted{
        Request storage req = requests[index];
        require(!req.complete);
        require(req.approvalCount>approversCount/2);
        req.recipient.transfer(req.value);
        req.complete = true;  
    }

    // getters
    function getManager() public view returns(address){
        return manager;
    }

    function getMinimumContribution() public view returns(uint){
        return minimumContribution;
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns(uint){
        return requests.length;
    }
}