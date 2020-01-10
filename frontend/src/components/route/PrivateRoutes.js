import React, { Component } from "react";
import * as allRoutes from "./index";
import rolesConfig from "../../config/roles";
import { Route, withRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { pageState } from "../../redux/actions/actions";


export class PrivateRoutes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allowedRoutes: [],
      redirectRoutes: ""
    };
  }

  componentDidMount() {
    let role = this.props.role;

    if (role) {
      this.setState({
        allowedRoutes: rolesConfig[role].routes,
        redirectRoutes: rolesConfig[role].redirect,
       
      });
      this.props.pageState(rolesConfig[role].page)

    } else {
      this.props.pageState('login')
      

    }
  }

  render() {
    //   console.log(this.state.redirectRoutes)
    return (
      <>
        {this.state.allowedRoutes.map(route => (
          <Route
            path={route.url}
            component={allRoutes[route.component]}
            key={route.url}
          />
        ))}
        <Redirect to={this.state.redirectRoutes} />
      </>
    );
  }
}
const mapDispatchToProps = {
  
  pageState: pageState
};

export default connect(null, mapDispatchToProps)(PrivateRoutes);
