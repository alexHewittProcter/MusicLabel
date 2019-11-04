import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as userSettingsSelectors from '../store/selectors/UserSettings.selector';
import * as userSettingsActions from '../store/actions/UserSettings.actions';
import * as userSettingsDataCalls from '../store/data/UserSettings.data';
import PageHeader from './helpers/PageHeader';

class SetupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '' };
		this.enterName = this.enterName.bind(this);
		this.updateSettings = this.updateSettings.bind(this);
	}
	render() {
		return (
			<div>
				<PageHeader text="Setup" />
				<Form className="text-left">
					<Form.Label>Name : </Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter name."
						value={this.state.name}
						onChange={this.enterName}
					/>
					<br />
					<Button variant="success" size="lg" block="true" onClick={this.updateSettings}>
						Go
					</Button>
				</Form>
			</div>
		);
	}
	enterName(event) {
		this.setState({ name: event.target.value });
	}
	async updateSettings() {
		const newSettings = {
			...this.props.userSettings,
			name: this.state.name,
			setup: true
		};
		try {
			const call = await userSettingsDataCalls.setUserSettings(newSettings);
			this.props.setSettings(call);
			this.props.history.push('/dashboard');
		} catch (e) {
			console.log(e);
		}
	}
}

export default connect(
	(state) => ({
		userSettings: userSettingsSelectors.getUserSettings(state)
	}),
	(dispatch) => ({
		setSettings: (settings) => {
			dispatch(userSettingsActions.setUserSettings(settings));
		}
	})
)(withRouter(SetupForm));
