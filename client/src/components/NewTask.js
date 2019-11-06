import React, { Component } from 'react';
import TaskSettings from './TaskSettings';
import { Task } from '../store/models/Tasks.models';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as fromTaskSelectors from '../store/selectors/Tasks.selector';
import * as fromTaskActions from '../store/actions/Tasks.actions';
import * as taskData from '../store/data/Tasks.data';

class NewTask extends Component {
	render() {
		const newTaskId = this.props.nextTaskId;
		return (
			<TaskSettings
				task={new Task()}
				title="New task"
				submitCallback={async (task) => {
					try {
						const tasks = [ ...this.props.tasks ];
						tasks.push(task);
						await taskData.setTasks(tasks);
						this.props.createNewTask(task);
						this.props.history.push('/task/' + newTaskId);
					} catch (e) {
						console.log(e);
					}
				}}
			/>
		);
	}
}

export default connect(
	(state) => {
		return {
			nextTaskId: fromTaskSelectors.getNextTaskId(state),
			tasks: fromTaskSelectors.getTasks(state)
		};
	},
	(dispatch) => {
		return { createNewTask: (task) => dispatch(fromTaskActions.addTask(task)) };
	}
)(withRouter(NewTask));
