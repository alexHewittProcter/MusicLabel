import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import Welcome from './Welcome';
import SetupForm from './SetupForm';

export default class Setup extends React.Component {
    render() {
        return (
            <Switch>
                <Route path='/welcome'>
                    <Welcome></Welcome>
                </Route>
                <Route path='/setup'>
                    <SetupForm mainApp={this.props.mainApp}></SetupForm>
                </Route>
                <Redirect to='/welcome'/>
            </Switch>
        )
    }
}