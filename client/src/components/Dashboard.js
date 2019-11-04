import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as taskSelectors from "../store/selectors/Tasks.selector";
import PageHeader from "./helpers/PageHeader";
import ListGroup from "react-bootstrap/ListGroup";
import TaskListItem from "./helpers/TaskListItem";

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <PageHeader text="Dashboard" />
        {this.props.tasks.length === 0 ? (
          <h2 className="text-center">Looks like you don't have any tasks</h2>
        ) : (
          <ListGroup>
            <TaskListItem
              index={1}
              task={{ name: "Name", folder: "Folder", labels: ["Labels"] }}
            />
            {this.props.tasks.map((task, index) => (
              <Link to={"/task/" + index} key={index}>
                <TaskListItem index={index + 1} task={task}></TaskListItem>
              </Link>
            ))}
          </ListGroup>
        )}
        <h3 className="text-center">
          <Link to="/newTask">Create new label task</Link> or read the{" "}
          <Link to="/howTo">how to</Link>
        </h3>
      </div>
    );
  }
}

export default connect(state => ({ tasks: taskSelectors.getTasks(state) }))(
  Dashboard
);
