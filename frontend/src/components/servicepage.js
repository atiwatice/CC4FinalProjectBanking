import React, { Component } from "react";
import "./servicepage.css";
import { Row, Col, Menu, Dropdown } from "antd";
import Accountpage from "./servicepages/accountpage";
import Transferpage from "./servicepages/transferpage";
import Stopaccountpage from "./servicepages/stopaccountpage";
import Paymentpage from "./servicepages/paymentpage";
import Adminpage from "./servicepages/adminpage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

export class Servicepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service: "Account"
    };
  }

componentDidMount(){
  const role = this.props.user.role;
  if(role=='admin'){
    this.setState({service:'Administrator'})
  }
}

  //Change service page
  handlePageClick = e => {
    const service = e.key;
    this.setState({ service });
  };

  render() {
    const role = this.props.user.role;

    const menu = (
      <div>
        {role == "user" ? (
          <Menu
            onClick={this.handlePageClick}
            selectedKeys={this.state.service}
          >
            <Menu.Item key="Account">
              <Link to="/service/account">
                <h3> Account</h3>
              </Link>
            </Menu.Item>
            <Menu.Item key="Transfer">
              <Link to="/service/transfer">
                <h3> Transfer</h3>
              </Link>
            </Menu.Item>
            <Menu.Item key="Stop Account">
              <Link to="/service/stopaccount">
                <h3> Stop Account</h3>
              </Link>
            </Menu.Item>
            <Menu.Item key="Payment">
              <Link to="/service/payment">
                <h3> Payment</h3>
              </Link>
            </Menu.Item>
          </Menu>
        ) : (
          <Menu
            onClick={this.handlePageClick}
            selectedKeys={this.state.service}
          >
            <Menu.Item key="Administrator">
              <Link to="/service/administrator">
                <h3> Administrator</h3>
              </Link>
            </Menu.Item>
          </Menu>
        )}
      </div>
    );

    return (
      <div>
        <Row
          type="flex"
          justify="start"
          align="bottom"
          style={{ height: "10vh" }}
        >
          <Col>
            <Dropdown overlay={menu}>
              <strong className="ant-dropdown-link">
                <span
                  style={{
                    backgroundColor: "white",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    paddingLeft: "55px",
                    paddingRight: "20px",
                    fontSize: "25px",
                    color: "black",
                    cursor: "pointer"
                  }}
                >
                  Service
                </span>
              </strong>
            </Dropdown>
          </Col>
          <Col>
            <strong>
              <span
                style={{
                  backgroundColor: "white",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                  paddingLeft: "20px",
                  paddingRight: "70px",
                  borderRadius: "0px 40px 40px 0px",
                  fontSize: "25px",
                  color: "black"
                }}
              >
                {this.state.service}
              </span>
            </strong>
          </Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ height: "70vh" }}
        >
          <Row>
            <div
              style={{
                backgroundColor: "white",
                width: "100vh",
                height: "60vh",
                borderRadius: "40px 40px 40px 40px"
              }}
            >
              <Switch>
                <Route exact path="/service/account">
                  <Accountpage />
                </Route>
                <Route exact path="/service/transfer">
                  <Transferpage />
                </Route>
                <Route exact path="/service/stopaccount">
                  <Stopaccountpage />
                </Route>
                <Route exact path="/service/payment">
                  <Paymentpage />
                </Route>
                <Route exact path="/service/administrator">
                  <Adminpage />
                </Route>
                {role == "user" ? (
                  <Redirect to="/service/account" />
                ) : (
                  <Redirect to="/service/administrator" />
                )}
              </Switch>
            </div>
          </Row>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  
  };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Servicepage);
