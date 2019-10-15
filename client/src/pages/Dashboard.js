import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom'; 

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        const userSettings = this.props.mainApp.state.userSettings;
        let tasks = userSettings.tasks;
        console.log(userSettings.tasks);
        if(userSettings.tasks === undefined || userSettings.tasks.length === 0) {
            tasks = [];
        }
        this.state = {
            tasks:tasks
        };
    }
    render() {
        console.log(this.state);
        return (<Switch>
            <Route path='/dashboard' exact>
                <div className='text-center'>
                    <h1>Dashboard</h1>
                    {this.state.tasks.length === 0? (<h2>Looks like you don't have any tasks</h2>):this.state.tasks.map(task => <div>{task}</div>)}
                    <h3><Link to='/newTask'>Create new label task</Link> or read the <Link to='/howTo'>how to</Link></h3>
                </div>
            </Route>
            <Redirect to='/dashboard'></Redirect>
        </Switch>)
    }
}