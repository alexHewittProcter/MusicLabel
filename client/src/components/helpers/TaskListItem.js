import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class TaskListItem extends Component {
  render() {
    return (
      <ListGroup.Item key={this.props.index}>
        <Row>
          <Col>{this.props.task.name}</Col>
          <Col>{this.props.task.folder}</Col>
          <Col>
            <ul>
              {this.props.task.labels.map((label, index) => (
                <li key={index}>{label}</li>
              ))}
            </ul>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  }
}
