import React from 'react';
import './App.css';
import {Container,Navbar,Nav} from 'react-bootstrap';
import MainPages from './pages/MainPages';
import {BrowserRouter} from 'react-router-dom';
import Setup from './pages/Setup';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const localUserSettings = localStorage.getItem('userSettings');
    this.state = {
      userSettings:localUserSettings !== null ? localUserSettings : {}
    };
  }
  componentDidMount() {
    fetch('/api/userinfo')
      .then(data => data.json())
      .then(data => {this.setState({userSettings:data});localStorage.setItem('userSettings',data)});
  }

  render() {
    console.log(localStorage.getItem('userSettings'));
    let mainPageView;
    if(Object.entries(this.state.userSettings).length === 0) {
      mainPageView = (<Setup mainApp={this}></Setup>);
    } else {
      mainPageView = (<MainPages mainApp={this}></MainPages>);
    }
    return (
      <BrowserRouter>
      <div className="App">
        <Navbar bg='dark' variant='dark' className='justify-content-between'>
          <Navbar.Brand>
            MusicLabel
          </Navbar.Brand>
          <Nav>
            <Nav.Link>
            {this.state.userSettings.name === undefined ? '' : 'Welcome back ' + this.state.userSettings.name}
            </Nav.Link>
          </Nav>
        </Navbar>
        <Container fluid={true}>
          {mainPageView}
        </Container>
      </div>
      </BrowserRouter>
    );
  }

  updateSettings(settings) {
    const newSettings = {...this.state.userSettings,...settings};
    fetch('/api/userinfo',{
      method:'POST',
      body: JSON.stringify(newSettings),
      headers:{
        'Content-type':'application/json',
      }
    })
      .then(data => data.json())
      .then(data => {this.setState({userSettings:data});
        localStorage.setItem('userSettings',data)
      });
  }
}
