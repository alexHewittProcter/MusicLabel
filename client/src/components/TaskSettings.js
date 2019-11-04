import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PageHeader from './helpers/PageHeader';
import fetch from 'node-fetch';
import { Task } from '../store/models/Tasks.models';

/**
 * TaskSettings is designed for reusability for both creation of new tasks and editing exising tasks
 *
 * expected props
 * - 'task' object
 * - 'title'
 * option props
 * - 'submitCallback' - the callback should have a single parameter of the returned task
 */
export default class TaskSettings extends React.Component {
	constructor(props) {
		super(props);
		this.submitTask = this.submitTask.bind(this);
		this.addLabel = this.addLabel.bind(this);
		this.removeLabel = this.removeLabel.bind(this);
		const { name, folder, labels } = this.props.task;
		this.state = {
			name: name,
			folder: folder,
			labels: labels,
			availibleFolders: [],
			currentLabelInput: ''
		};
	}

	componentDidMount() {
		//Fetch the availible folders
		fetch('/api/inputfolders').then((data) => data.json()).then((data) => {
			console.log(data);
			this.setState(
				(state) =>
					data.indexOf(state.folder) === -1
						? { availibleFolders: data, folder: data[0] }
						: { availibleFolders: data }
			);
		});
	}

	render() {
		console.log('STATE');
		console.log(this.state);
		return (
			<div>
				<PageHeader text={this.props.title} />
				<Form>
					<Form.Group>
						<Form.Label>Task name :</Form.Label>
						<Form.Control
							onChange={(e) => this.setState({ name: e.target.value })}
							placeholder="Insert name for your task here"
							name="taskName"
							value={this.state.name}
							required
						/>
						<Form.Text className="text-muted">
							This will be the name of the folder your task files output to
						</Form.Text>
					</Form.Group>
					<Form.Group>
						<Form.Label>Task file folder :</Form.Label>
						<Form.Control
							as="select"
							onChange={(e) => this.setState({ folder: e.target.value })}
							value={this.state.folder}
						>
							{this.state.availibleFolders.map((folder, index) => {
								return <option key={index}>{folder}</option>;
							})}
						</Form.Control>
						{this.state.availibleFolders.length === 0 ? (
							<Form.Text className="text-muted">
								We can't find any folders to get files from, please make sure that all your folders and
								placed inside 'input_files'
							</Form.Text>
						) : (
							''
						)}
					</Form.Group>
					<Form.Group>
						<Form.Label>Labels :</Form.Label>
						<ul>
							{this.state.labels.map((label, index) => (
								<li key={index}>
									{label}{' '}
									<span
										style={{ cursor: 'pointer' }}
										onClick={() => {
											console.log(index);
											this.removeLabel(index);
										}}
									>
										X
									</span>
								</li>
							))}
						</ul>
						<Form.Control
							placeholder="Enter your new label here"
							value={this.state.currentLabelInput}
							onChange={(e) => this.setState({ currentLabelInput: e.target.value })}
						/>
						<br />
						<Button size="larger" block="true" type="button" onClick={this.addLabel}>
							Add label
						</Button>
					</Form.Group>
					<Button type="button" variant="success" size="lg" block="true" onClick={this.submitTask}>
						Go
					</Button>
				</Form>
			</div>
		);
	}

	addLabel() {
		this.setState((state) => {
			const newLabels = state.labels;
			newLabels.push(state.currentLabelInput);
			return {
				labels: newLabels,
				currentLabelInput: ''
			};
		});
	}

	removeLabel(index) {
		this.setState((state) => {
			const labels = state.labels;
			labels.splice(index, 1);
			console.log(labels);
			return { labels: labels };
		});
	}

	submitTask(e) {
		e.preventDefault();
		const { name, folder, labels } = this.state;
		const newTask = new Task();
		newTask.name = name;
		newTask.folder = folder;
		newTask.labels = labels;
		console.log(newTask);
		if (this.props.submitCallback !== undefined) {
			this.props.submitCallback(newTask);
		}
	}
}
