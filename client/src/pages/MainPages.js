import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewTask from './NewTask';
export default class MainPages extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/dashboard'>
                    <Dashboard mainApp={this.props.mainApp}></Dashboard>
                </Route>
                <Route path='/tasks'>

                </Route>
                <Route path='/task:id'>

                </Route>
                <Route path='/newTask'>
                    <NewTask></NewTask>
                </Route>
                <Route path='/howTo'>

                </Route>
                <Redirect to='/dashboard'></Redirect>
            </Switch>
        );
    }
}