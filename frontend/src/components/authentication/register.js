import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col, Card } from "antd";
import "./login.css";
import Axios from "../../config/axios.setup";
import { BrowserRouter as Link } from "react-router-dom";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: false
    };
  }

  handleDirtyBlur = e => {
    const { value } = e.target;
    this.setState({ isDirty: this.state.isDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Password และ Confirm password ไม่ตรงกัน");
    } else {
      callback();
    }
  };

  compareToSecondPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.isDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  submitForm = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        Axios.post("/registerUser", {
          username: value.username,
          password: value.password,
          firstname: value.firstname,
          lastname: value.lastname
        })
          .then(result => {
            this.props.history.push("/login");
            window.location.reload(true);
          })
          .catch(err => {
            console.error(err);
          });
        this.props.form.resetFields();
      }
    });
  };
  handleOnClick = () => {
    this.props.form.resetFields();
    this.props.history.push("/login");
    window.location.reload(true);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: "80vh" }}
      >
        <Card title={<h1>Register</h1>} style={{ width: "400px" }}>
          <Form onSubmit={this.submitForm} className="login-form">
            <Form.Item label="Firstname" style={{ margin: "0" }}>
              {getFieldDecorator("firstname", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาใส่ Firstname ด้วยครับ"
                  }
                ]
              })(
                <Input
                  
                  placeholder="Firstname"
                />
              )}
            </Form.Item>

            <Form.Item label="Lastname" style={{ margin: "0" }}>
              {getFieldDecorator("lastname", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาใส่ Lastname ด้วยครับ"
                  }
                ]
              })(
                <Input
                
                  placeholder="Lastname"
                />
              )}
            </Form.Item>

            <Form.Item label="Username" style={{ margin: "0" }}>
              {getFieldDecorator("username", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาใส่ Username ด้วยครับ"
                  }
                ]
              })(
                <Input
                  
                  placeholder="Username"
                />
              )}
            </Form.Item>

            <Form.Item label="Password" style={{ margin: "0" }}>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาใส่ Password ด้วยครับ"
                  },
                  {
                    validator: this.compareToSecondPassword
                  }
                ]
              })(
                <Input.Password
                  
                  placeholder="Password"
                />
              )}
            </Form.Item>

            <Form.Item label="Confirm Password" style={{ margin: "5" }}>
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "กรุณาใส่ Confirm Password ด้วยครับ"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input.Password
                  
                  placeholder="Confirm Password"
                  onBlur={this.handleDirtyBlur}
                />
              )}
            </Form.Item>

            <Form.Item>
              <Row type="flex" justify="space-around">
                <Col>
                  <Button
                    style={{ color: "rgba(255,255,255)",borderRadius: "25px" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Register
                  </Button>
                </Col>
                <Col>
                  <Button
                    style={{ color: "rgba(255,255,255)",borderRadius: "25px" }}
                    type="primary"
                    onClick={this.handleOnClick}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>
      </Row>
    );
  }
}

export default Form.create()(Register);
