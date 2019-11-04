import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import * as fileData from '../store/data/Files.data';

export default class MusicFileItem extends Component {
	constructor(props) {
		super(props);
		this.selectLabel = this.selectLabel.bind(this);
	}
	async selectLabel(label) {
		console.log(label);
		//Move file
		const file = this.props.file;
		const task = this.props.task;
		try {
			await fileData.classifyFile(task.folder, file.fileName, task.name, label);
			this.props.onRemove();
		} catch (e) {
			console.log(e);
		}
	}
	render() {
		const file = this.props.file;
		const labels = this.props.task.labels;
		return (
			<ListGroup.Item>
				<Row>
					<Col xs={8}>
						<Row>
							<Col>{file.title}</Col>
							<Col>{file.artists.join(', ')}</Col>
						</Row>
					</Col>
					<Col xs={4}>
						<Row>
							{labels.map((label, index) => (
								<Button
									key={index}
									size="lg"
									onClick={() => {
										this.selectLabel(label);
									}}
								>
									{label}
								</Button>
							))}
						</Row>
					</Col>
				</Row>
			</ListGroup.Item>
		);
	}
}
