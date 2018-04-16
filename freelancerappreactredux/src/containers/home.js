import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {displayProjectDetails, displayAllProjects,logoutUser,getListOfAllBids,getListOfAllProjectsAsEmployer,getListOfAllProjectsBidOn,checklogin} from "../actions";
import { ButtonToolbar, Button} from 'react-bootstrap'
import { Card, CardImg, CardBody, CardTitle,Row, Col } from 'reactstrap';
import history from "./history";
import image from "./myProfile.jpg";

class Home extends Component {

    constructor() {
        super();
        this.state = {
            projectId:'',
            status:'',
            relevantProject:false,
            search:'',
            currentPage: 1,
            ProjectsPerPage: 3
        };
        this.handleClick = this.handleClick.bind(this);
    }


    componentDidMount() {

        if(this.props.session.userData.message==="loggedOut")
        {
            history.push('/login');
        }
        this.props.displayAllProjects({user_id:localStorage.getItem('user_id'),name:'aditya'});

        if(this.state.status==="loggedOut")
        {
            history.push('/login');
        }

    }

    componentWillUpdate(nextProps, nextState){

        if(nextState.status==="loggedOut")
        {
            history.push('/login');
        }

    }

    componentWillReceiveProps(nextProps){

        this.setState({status:nextProps.session.userData.message});

        if(nextProps.session.userData.message==="loggedOut")
        {
            history.push('/login');
        }

    }

    componentWillMount() {
        /*this.props.checklogin();*/
    }


    handleProjectClick = (e,projectName) => {
        e.preventDefault();
        var projectDetails={projectId:projectName,projectName:"me"};
        this.setState({projectId:projectName});
        localStorage.setItem('projectId',projectName);
        this.props.displayProjectDetails(projectDetails);
        this.props.getListOfAllBids(projectDetails);
        localStorage.setItem('projectDisable',false);
        history.push('/details');

    }

    logout = (e) => {
        e.preventDefault();
        this.props.logoutUser();
    }

    getDashboard = (e) => {
        e.preventDefault();
        var userDetails={user_id:localStorage.getItem('user_id')};
        this.props.getListOfAllProjectsAsEmployer(userDetails);
        this.props.getListOfAllProjectsBidOn(userDetails);
        history.push('/dashboard');
    }

    postProject = (e) => {
        e.preventDefault();
        history.push('/postproject');
    }

    getProfile = (e) => {
        e.preventDefault();
        history.push('/profile');
    }
    showRelevantProject = (e) => {
        this.setState({relevantProject:true})
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }


    renderList() {
        if (this.props.projects.length !== undefined) {

            const currentPage = this.state.currentPage;
            const ProjectsPerPage=this.state.ProjectsPerPage;
            const projects=this.props.projects;

            // Logic for displaying current todos
            const indexOfLastProject = currentPage * ProjectsPerPage;
            const indexOfFirstProject = indexOfLastProject - ProjectsPerPage;
            const currentProject = projects.slice(indexOfFirstProject, indexOfLastProject);

            let filteredProject=currentProject.filter(
                (project) => {
                    return project.name.toLowerCase().indexOf(this.state.search.toLowerCase())!==-1;
                }
            );


            return filteredProject.map((project) => {
                return (
                    <li className="list-group-item list-group-item-info"
                        key={project.project_id}
                        onClick={(event) => this.handleProjectClick(event,project.name)}>
                        Name: {project.name}
                        <br/>
                        Description: {project.description}
                        <br/>
                        <br/>
                    </li>

                );
            });


        }
    }

    renderListOfRelevantProjects() {
        if (this.props.projects !== "No Result") {

            return this.props.projects.map((project) => {
                    var stringArray = project.skills_required.split(',');
                    var numCount=0;
                    for (var i = 0; i < stringArray.length; i++) {
                        if (stringArray[i].match("Mean Stack")) {

                            numCount++;
                        }
                    }
                        if(numCount===1) {
                            return (
                                <li className="list-group-item list-group-item-info"
                                    key={project.project_id}
                                    onClick={(event) => this.handleProjectClick(event)}>

                                    Name: {project.name}
                                    <br/>
                                    Description: {project.description}
                                    <br/>
                                    <br/>

                                </li>

                            );
                        }

                    return null;
                }
            );

        }
    }

    render() {

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.props.projects.length / this.state.ProjectsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });

            return (
                <div>
                    <Row>
                        <input type="text" value={this.state.searchResult} onChange={(event) => {
                            this.setState({
                                search:event.target.value
                            })
                            }}/>

                    </Row>


                    <Row>
                        <Col sm="3">
                            <Card body>
                                <CardTitle>Welcome {this.props.session.userData.username}</CardTitle>
                                <CardImg top width="100%" src={image} alt="Card image cap" />
                            </Card>
                        </Col>
                        <Col sm="9">
                            <Card body>
                                <CardBody>
                                    <ButtonToolbar>
                                        <Button bsStyle="link" onClick={(event) => this.getProfile(event)}>Profile</Button>
                                        <Button bsStyle="link" onClick={(event) => this.showRelevantProject(event)}>Relevant Projects</Button>
                                        <Button bsStyle="link" onClick={(event) => this.postProject(event)}>Post Project</Button>
                                        <Button bsStyle="link" onClick={(event) => this.getDashboard(event)}>Dashboard</Button>
                                        <Button bsStyle="link" onClick={(event) => this.logout(event)}>Logout</Button>
                                        <Button bsStyle="link" onClick={(event) => history.push('/Account')}>Account</Button>
                                    </ButtonToolbar>

                                    {!this.state.relevantProject ? <ul className="list-group text-center">
                                        {this.renderList()}
                                        </ul> : <ul className="list-group text-center">
                                        {this.renderListOfRelevantProjects()}
                                    </ul>}


                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        {renderPageNumbers}
                    </Row>

            </div>

            );

    }
}

function mapStateToProps(state) {
    return {
        projects:state.projects,
        session:state.loginsigup
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({displayProjectDetails: displayProjectDetails,displayAllProjects:displayAllProjects,logoutUser:logoutUser,getListOfAllBids:getListOfAllBids,getListOfAllProjectsAsEmployer:getListOfAllProjectsAsEmployer,getListOfAllProjectsBidOn:getListOfAllProjectsBidOn,checklogin:checklogin}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Home);