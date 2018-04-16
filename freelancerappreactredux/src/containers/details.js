import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {displayProjectDetails,makeBid,getListOfAllBids,hireFreelancer} from "../actions";
import { Grid, Row,FormControl,Label} from 'react-bootstrap';
import {ListGroup, ListGroupItem} from 'reactstrap'
import {Tabs, Tab} from 'react-bootstrap-tabs'




class Details extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bidValue:'',
            projectId:localStorage.getItem('projectId'),
            userId:localStorage.getItem('user_id'),
            days:'',
            changed:'',
            disable:localStorage.getItem('projectDisable')
        };

    }


    componentWillReceiveProps(nextProps){

        if(nextProps)
        {
            this.setState({
                changed:'Yes'
            })
        }

    }
    hireFreelancer=(e,user)=>{
        e.preventDefault();
        var projectDetails={projectId:this.props.project.name,bidValue:this.state.bidValue,days:this.state.days,userId:this.props.loginsigup.data.name};
        this.props.hireFreelancer(projectDetails);
        document.getElementById("bidList").style.visibility='hidden'
    }
    sortOrder=(event,str)=>{
    event.preventDefault();
    if(str==="asc")
    {
        this.props.selectedProjectBids.sort(function(a, b){return (a.bid_value-b.bid_value)});
    }
    else{
        this.props.selectedProjectBids.sort(function(a, b){return (b.bid_value-a.bid_value)});
    }

}

    renderBidsList() {
        if (this.props.selectedProjectBids != null) {

            return this.props.selectedProjectBids.map((user) => {
                return (
                    <ListGroupItem action

                        key={user._id}>
                        <Label>Name: </Label>{user.username}<br/>
                        <Label>Bid: </Label>{user.bid_value}<br/>
                        {this.state.disable==='true' && <div>
                            <button id={user._id}
                                className="btn btn-primary"
                                type="button"
                                onClick={(e) => this.hireFreelancer(e,user)}>
                                Hire
                            </button>
                            </div>}
                    </ListGroupItem>

                );
            });
        }
    }

    markBid = (e) => {
        e.preventDefault();
        var projectDetails={projectId:this.props.project.name,bidValue:this.state.bidValue,days:this.state.days,userId:this.props.loginsigup.data.name};
        this.props.makeBid(projectDetails);
        this.props.getListOfAllBids(projectDetails);
    }



    renderItem() {

        if (this.props.project != null) {
                return (
                        <Grid>
                            <Row className="text-center"><h1>Projects Details</h1></Row>

                <Tabs
            defaultActiveKey={1}
            id="controlled-tab-example"
                >
                <Tab eventKey={1} label="Projects Details">
            <div>
                    Name: {this.props.project.name}<br/>
                    Description: {this.props.project.description}<br/>
                    Skill Required: {this.props.project.skills_required}<br/>
                    Budget Range: {this.props.project.budget_range}<br/>
                    Status: {this.props.project.status}<br/>
                    Estimate Project Completion Date: {this.props.project.estimate_project_completion_date.toString().slice(0,10)}<br/><br/>
                {this.state.disable==='false' && <form>
                    <FormControl
                        id="formControlsText"
                        type="number"
                        label="Bid:"
                        value={this.state.bidValue}
                        placeholder="Enter Bid Value"
                        onChange={(event) => {
                            this.setState({
                                bidValue:event.target.value,
                                projectId:this.props.project.project_id
                            });
                        }}
                    />
                    <br/>
                    <FormControl
                        id="formControlsText"
                        type="number"
                        label="No of Days To Complete:"
                        value={this.state.days}
                        placeholder="Enter Number of Days"
                        onChange={(event) => {
                            this.setState({
                                days:event.target.value
                            });
                        }}
                    />
                    <br/>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(event) => this.markBid(event)}>
                        Bid
                    </button>
                </form>}

            </div>
        </Tab>
            <Tab eventKey={2} label="All Bids">
                <button id="asc" onClick={(event)=> this.sortOrder(event,"asc")}>Sort Ascending Order
                </button>
                <button id="desc" onClick={(event)=> this.sortOrder(event,"desc")}>Sort Descending Order
                </button>
                <ListGroup id="bidList">
                    {this.renderBidsList()}
                </ListGroup>
            </Tab>
        </Tabs>
                        </Grid>
                );

        }
    }

    render() {

        return (
            <div className="container-fluid">
                            {this.renderItem()}
            </div>

        );

    }
}

function mapStateToProps(state) {
    return {
        project:state.selectedproject,
        selectedProjectBids:state.selectedprojectbids,
        loginsigup:state.loginsigup
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({displayProjectDetails: displayProjectDetails,makeBid:makeBid,getListOfAllBids:getListOfAllBids,hireFreelancer:hireFreelancer}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Details);