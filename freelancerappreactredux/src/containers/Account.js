import React, {Component} from 'react';
import { Grid, Row,FormControl,Label} from 'react-bootstrap';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import {BarChart} from 'react-d3-components';
import PieChart from 'react-minimal-pie-chart';





class Account extends Component {

    constructor(props) {
        super(props);

        this.state = {
            arrayList:[1000,-1100,3000,5000,-4000,8000,-4000]
        };

    }

    changeArray=(event)=>
    {
        event.preventDefault();
        var changeValue = Number(document.getElementById("fadd").value);
        if(document.getElementById("action").value==="Add")
        {
            this.setState({
                arrayList:this.state.arrayList.concat(changeValue)
            });

        }
        else
        {
            this.setState({
                arrayList:this.state.arrayList.concat(-changeValue)
            })
        }
    }



    renderItem() {


        var values=[];

        var incoming=0;

        var outgoing=0;

        for(var i=0;i<this.state.arrayList.length;i++)
        {
            values.push({x:i+"", y:this.state.arrayList[i]});
            if(this.state.arrayList[i]>0)
            {
                incoming+=this.state.arrayList[i];
            }
            else
            {
                outgoing+=this.state.arrayList[i];
            }

        }

        var total = incoming-outgoing;

        var data = [{
            label: 'somethingA',
            values: values
        }];

            return (
                <Grid>
                    <Row className="text-center"><h1>Transactional Manager</h1></Row>

                    <Row className="text-center"><h3> Current Balance: {this.state.arrayList.reduce((a, b) => a + b)}</h3></Row>

                    <Tabs
                        defaultActiveKey={1}
                        id="account"

                    >
                        <Tab eventKey={1} label="Account">
                        <div>


                                <h3>Add or Withdraw Amount to your Account</h3>

                                <div>
                                    <form >
                                        <label >Amount</label>
                                        <input type="number" id="fadd" name="Add Money" placeholder="Enter Amount"/>


                                            <br/>
                                            <br/>
                                            <label >Operation</label>
                                            <select id="action" name="Operation">
                                                <option value="Add">Add</option>
                                                <option value="Withdraw">Withdraw</option>
                                            </select>

                                            <input type="button" onClick={(event)=> this.changeArray(event)} value="Submit"/>
                                    </form>
                                </div>





                        </div>
                        </Tab>
                        <Tab eventKey={2} label="Graph Data">

                            <BarChart
                                data={data}
                                width={400}
                                height={400}
                                margin={{top: 10, bottom: 50, left: 50, right: 10}}/>


                        </Tab>
                        <Tab eventKey={3} label="Pie Chart">

                            <PieChart radius={25}
                                data={[
                                    { value: incoming, key: 1, color: '#008000' },
                                    { value: -outgoing, key: 2, color: '#C13C37' }
                                ]}
                            />

                        </Tab>
                    </Tabs>
                </Grid>
            );


    }

    render() {

        return (
            <div className="container-fluid">
                {this.renderItem()}
            </div>

        );

    }
}

export default Account;