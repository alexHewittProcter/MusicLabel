import React from "react";
import { Redirect, Route } from "react-router-dom";

export default class ProtectedRoute extends React.Component {
  render() {
    const { children, isAllowed, redirectUrl, ...rest } = this.props;
    return isAllowed ? (
      <Route {...rest}>{children}</Route>
    ) : (
      <Redirect to={redirectUrl} />
    );
  }
}
