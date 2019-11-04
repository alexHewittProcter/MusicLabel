import React, { Component } from 'react';
import TaskSettings from './TaskSettings';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as fromTaskSelectors from '../store/selectors/Tasks.selector';
import * as fromTaskActions from '../store/actions/Tasks.actions';
import * as taskData from '../store/data/Tasks.data';

class EditTask extends Component {
	render() {
		return (
			<TaskSettings
				task={this.props.task}
				title="Edit task"
				submitCallback={async (task) => {
					try {
						const tasks = [ ...this.props.tasks ];
						tasks[this.props.taskId] = task;
						await taskData.setTasks(tasks);
						this.props.updateTask(task, this.props.taskId);
						this.props.history.push('/task/' + this.props.taskId);
					} catch (e) {
						throw e;
					}
				}}
			/>
		);
	}
}

export default connect(
	(state, ownProps) => {
		return {
			task: fromTaskSelectors.getTask(state, ownProps.match.params.id),
			taskId: ownProps.match.params.id,
			tasks: fromTaskSelectors.getTasks(state)
		};
	},
	(dispatch) => {
		return { updateTask: (task, index) => dispatch(fromTaskActions.updateTask(task, index)) };
	}
)(withRouter(EditTask));
