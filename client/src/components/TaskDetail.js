import React, { Component } from 'react';
import PageHeader from './helpers/PageHeader';
import { connect } from 'react-redux';
import * as tasksSelectors from '../store/selectors/Tasks.selector';
import * as selectedTaskSelectors from '../store/selectors/SelectedTask.selector';
import * as selectedTaskActions from '../store/actions/Selected-Task.actions';
import * as filesData from '../store/data/Files.data';
import ListGroup from 'react-bootstrap/ListGroup';
import MusicFileItem from './MusicFileItem';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

class TaskDetail extends Component {
	constructor(props) {
		super(props);
		this.state = { noResults: false };
		this.getFiles = this.getFiles.bind(this);
	}
	componentDidMount() {}

	async getFiles() {
		console.log('GET FILES');
		try {
			const call = await filesData.getFiles(this.props.task.folder);
			console.log(call);
			let results = false;
			if (call.length === 0) {
				results = true;
			}
			this.props.setFiles(call);
			this.setState({ noResults: results });
			console.log('FILES');
			console.log(this.props.files);
		} catch (e) {
			console.log(e);
		}
	}

	removeFile(index) {
		const files = this.props.files;
		files.splice(index, 1);
		this.props.setFiles(files);
	}

	render() {
		if (this.props.files.length === 0 && this.state.noResults === false) {
			this.getFiles();
		}
		return (
			<div>
				<PageHeader text={'Task - ' + this.props.task.name} />
				<Link to={'/edit/' + this.props.match.params.id}>Edit task</Link>
				{this.props.files.length === 0 ? (
					<Jumbotron>
						<h1>No files found</h1>
						<p>
							Looks like there are no files in the folder for this task, move some files into there and
							click refresh!
						</p>
						<p>
							<Button variant="primary" onClick={this.getFiles}>
								Refresh
							</Button>
						</p>
					</Jumbotron>
				) : (
					<ListGroup>
						{this.props.files.map((file, index) => (
							<MusicFileItem
								key={index}
								file={file}
								task={this.props.task}
								onRemove={() => {
									this.removeFile(index);
									this.getFiles();
								}}
							/>
						))}
					</ListGroup>
				)}
			</div>
		);
	}
}

export default connect(
	(state, ownProps) => {
		return {
			task: tasksSelectors.getTask(state, ownProps.match.params.id),
			files: selectedTaskSelectors.getSelectedTaskFiles(state)
		};
	},
	(dispatch) => ({
		setFiles: (files) => {
			dispatch(selectedTaskActions.setSelectedTaskFiles(files));
		}
	})
)(TaskDetail);
