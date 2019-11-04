import React from 'react';
import './App.css';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userSettingsSelectors from './store/selectors/UserSettings.selector';
import * as userSettingsActions from './store/actions/UserSettings.actions';
import * as tasksSelectors from './store/selectors/Tasks.selector';
import * as taskData from './store/data/Tasks.data';
import * as taskActions from './store/actions/Tasks.actions';
import * as userSettingsData from './store/data/UserSettings.data';
import * as userSettingsReducer from './store/reducers/UserSettings.reducer';
import * as taskReducer from './store/reducers/Tasks.reducer';
import Welcome from './components/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import NewTask from './components/NewTask';
import SetupForm from './components/SetupForm';
import TaskDetail from './components/TaskDetail';
import EditTask from './components/EditTask';

class App extends React.Component {
	constructor(props) {
		super(props);
		const localUserSettings = userSettingsData.getUserSettingsStorage();
		if (Object.keys(localUserSettings).length > 0) {
			this.props.setSettings(localUserSettings);
		} else {
			this.props.setSettings({ ...userSettingsReducer.initialState, setup: false });
		}
		const localTasks = taskData.getTasksStorage();
		if (localTasks.length > 0) {
			this.props.setTasks(localTasks);
		}
		console.log(localTasks);
		setInterval(() => {
			console.log(this.props.userSettings);
			console.log(this.props.tasks);
		}, 5000);
	}
	async componentDidMount() {
		try {
			const data = await userSettingsData.getUserSettingsApi();
			if (Object.keys(data).length > 0) {
				userSettingsData.setUserSettingsStorage(data);
				this.props.setSettings(data);
			} else {
				//Set user settings back to initial
				this.props.setSettings({ ...userSettingsReducer.initialState, setup: false });
				userSettingsData.setUserSettingsStorage({ ...userSettingsReducer.initialState, setup: false });
			}
		} catch (e) {
			console.log(e);
		}
		try {
			const tasks = await taskData.getTasksApi();
			if (tasks.length > 0) {
				taskData.setTasksStorage(tasks);
				this.props.setTasks(tasks);
			} else {
				this.props.setTasks(taskReducer.initialState);
				taskData.setTasksStorage(taskReducer.initialState);
			}
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const isSetup = this.props.userSettings.setup;
		console.log(this.props.userSettings);
		console.log(`Is setup ${isSetup}`);
		return (
			<BrowserRouter>
				<div className="App">
					<Navbar bg="dark" variant="dark" className="justify-content-between">
						<Link to="/">
							<Navbar.Brand>MusicLabel</Navbar.Brand>
						</Link>
						<Nav>
							<Nav.Link>
								{this.props.userSettings.setup === false ? (
									''
								) : (
									'Welcome back, ' + this.props.userSettings.name
								)}
							</Nav.Link>
						</Nav>
					</Navbar>
					<Container fluid={true}>
						<Switch>
							<ProtectedRoute isAllowed={!isSetup} redirectUrl="/dashboard" path="/welcome">
								<Welcome />
							</ProtectedRoute>
							<ProtectedRoute isAllowed={!isSetup} redirectUrl="/dashboard" path="/setup">
								<SetupForm />
							</ProtectedRoute>
							<ProtectedRoute isAllowed={isSetup} redirectUrl="/welcome" path="/dashboard">
								<Dashboard />
							</ProtectedRoute>
							<ProtectedRoute isAllowed={isSetup} redirectUrl="/welcome" path="/tasks" />
							<ProtectedRoute
								isAllowed={isSetup}
								redirectUrl="/welcome"
								path="/task/:id"
								component={TaskDetail}
							/>
							<ProtectedRoute isAllowed={isSetup} redirectUrl="/welcome" path="/newTask">
								<NewTask />
							</ProtectedRoute>
							<ProtectedRoute
								isAllowed={isSetup}
								redirectUrl="/welcome"
								path="/edit/:id"
								component={EditTask}
							/>
							<Route path="/howTo" />
							<Redirect to="/dashboard" />
						</Switch>
					</Container>
				</div>
			</BrowserRouter>
		);
	}
}

export default connect(
	(state) => ({
		userSettings: userSettingsSelectors.getUserSettings(state),
		tasks: tasksSelectors.getTasks(state)
	}),
	(dispatch) => ({
		setSettings: (settings) => {
			dispatch(userSettingsActions.setUserSettings(settings));
		},
		setTasks: (tasks) => {
			dispatch(taskActions.setTasks(tasks));
		}
	})
)(App);
