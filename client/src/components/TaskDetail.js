import React, { Component } from 'react';
import PageHeader from './helpers/PageHeader';
import { connect } from 'react-redux';
import * as tasksSelectors from '../store/selectors/Tasks.selector';
import * as filesData from '../store/data/Files.data';
import ListGroup from 'react-bootstrap/ListGroup';
import MusicFileItem from './MusicFileItem';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

class TaskDetail extends Component {
	constructor(props) {
		super(props);
		this.state = { files: [], noResults: false };
		this.getFiles = this.getFiles.bind(this);
		this.removeFile = this.removeFile.bind(this);
	}
	componentDidMount() {}

	async getFiles() {
		try {
			const call = await filesData.getFiles(this.props.task.folder);
			let results = false;
			if (call.length === 0) {
				results = true;
			}
			this.setState({ files: call, noResults: results });
		} catch (e) {
			console.log(e);
		}
	}

	removeFile(index) {
		this.setState((state) => {
			const files = state.files;
			files.splice(index, 1);
			return {
				files: files
			};
		});
	}

	render() {
		if (this.state.files.length === 0 && this.state.noResults === false) {
			this.getFiles();
		}
		console.log("Tasl");
		console.log(this.props);
		return (
			<div>
				<PageHeader text={'Task - ' + this.props.task.name} />
				<Link to={'/edit/' + this.props.match.params.id}>Edit task</Link>
				{this.state.files.length === 0 ? (
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
						{this.state.files.map((file, index) => (
							<MusicFileItem
								key={index}
								file={file}
								task={this.props.task}
								onRemove={() => {
									this.removeFile(index);
								}}
							/>
						))}
					</ListGroup>
				)}
			</div>
		);
	}
}

export default connect((state, ownProps) => {
	return {
		task: tasksSelectors.getTask(state, ownProps.match.params.id)
	};
})(TaskDetail);
