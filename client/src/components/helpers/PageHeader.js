import React, { Component } from "react";

export default class PageHeader extends Component {
  render() {
    return (
      <div className="pb-2 mt-4 mb-2 border-bottom">
        <h1>{this.props.text}</h1>
      </div>
    );
  }
}
