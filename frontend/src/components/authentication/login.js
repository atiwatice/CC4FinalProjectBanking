import React from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col, Card } from "antd";
import "./login.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { connect } from "react-redux";
import { login,pageState } from "../../redux/actions/actions";
import Axios from "../../config/axios.setup";
import {
  failLoginNotification,
  successLoginNotification
} from "../notification/notification";
class Login extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.post("/loginUser", {
          username: values.username,
          password: values.password
        })
          .then(result => {
            const user = jwtDecode(result.data.token);
            this.props.login(user, result.data.token);
            successLoginNotification();
            this.props.history.push("/");
            this.props.pageState('homepage')
            window.location.reload(true);
          })
          .catch(err => {
            console.error(err);
            this.props.form.resetFields();
            failLoginNotification("something went wrong.");
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: "100vh" }}
      >
        <Card title={<h1>Online Banking</h1>}>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="Username">
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "Please input your nickname!"
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                  style={{ borderRadius: "25px" }}
                />
              )}
            </Form.Item>
            <Form.Item label="Password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!"
                  }
                ]
              })(
                <Input.Password
                  prefix={
                    <Icon
                      type="lock"
                      style={{ color: "rgba(0,0,0,.25)" }}
                      placeholder="Password"
                      style={{ borderRadius: "25px" }}
                    />
                  }
                />
              )}
            </Form.Item>
            <Form.Item>
              <Checkbox>Remember me</Checkbox>
              <a className="login-form-forgot" href="#">
                Forgot password
              </a>
              <Button
                style={{ color: "rgba(255,255,255)" }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              Or <Link to="/register">register now!</Link>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    );
  }
}
const mapDispatchToProps = {
  login: login,
  pageState:pageState
};
const LoginForm = Form.create({ name: "login" })(Login);
export default connect(null, mapDispatchToProps)(LoginForm);
// export default withRouter(Login);
