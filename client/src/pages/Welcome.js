import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import { Switch, Route, Link, Redirect} from 'react-router-dom';

export default class StartUpPage extends React.Component{
    render() {
        return (
            <Switch>
                <Route path='/welcome'>
                    <Jumbotron>
                        <h1>Hey, welcome to MusicLabel, a tool for sorting your music.</h1>
                        <h2>Before you can start, we just need you to set up a few things!</h2>
                        <Link to='/setup'>
                            <Button variant='success'>Get started</Button>
                        </Link>
                    </Jumbotron>
                </Route>
                <Redirect to='/welcome'></Redirect>
            </Switch>
        );
    }
}