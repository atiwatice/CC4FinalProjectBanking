import React, { Component } from "react";
import { Menu, Icon } from "antd";
import Homepage from "./components/homepage";
import Login from "./components/authentication/login";
import Register from "./components/authentication/register";
import Servicepage from "./components/servicepage";
import { Route, Switch, Link,Redirect } from "react-router-dom";
import backgroundImage from "./SecurityFinal.png";
import { logoutNotification } from "./components/notification/notification";
import { connect } from "react-redux";
import { logout,pageState } from "./redux/actions/actions";
import PrivateRoutes from "./components/route/PrivateRoutes";

export class App extends Component {
  
  componentDidMount() {}
  //Change page
  handlePageClick = e => {
    const page = e.key;
    this.props.pageState(page)
    

    const role = this.props.user.role;
    // console.log(role)
    if (this.props.mainpage.mainpage == "logout" && (role == "user" || role == "admin")) {
      this.props.logout();
      logoutNotification();
      window.location.reload(true);
      this.props.pageState('login')
    }
  };

  render() {
    
    const role = this.props.user.role;
    const mainpage = this.props.mainpage.mainpage;
    return (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          height: "100vh"
        }}
      >
        <Menu
          mode="horizontal"
          selectedKeys={mainpage}
          onClick={this.handlePageClick}
          theme="light"
          style={{ width: "450px" }}
        >
          <Menu.Item key="homepage">
            <Link to="/homepage">
              <Icon type="home" />
              <span>Homepage</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="login">
            <Link to="/login">
              <Icon type="login" />
              <span>LogIn</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="service">
            <Link to="/service">
              <Icon type="tool" />
              <span>Service</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="logout">
            <Icon type="tool" />
            <span>LogOut</span>
          </Menu.Item>
        </Menu>

        <Switch>
          {/* <Route exact path="/homepage" component={Homepage} />

          <Route exact path="/login" component={Login} />

          <Route exact path="/register" component={Register} />
          {role == "user" || role == "admin" ? (
            <Route path="/service" component={Servicepage} />
          ) : (
            <Route exact path="/login" component={Login} />
          )}
          <Redirect to="/homepage" /> */}
           <PrivateRoutes role={role} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    mainpage:state.mainpage
  };
};
const mapDispatchToProps = {
  logout: logout,
  pageState: pageState
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
