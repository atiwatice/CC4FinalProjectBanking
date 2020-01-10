import React, { Component } from "react";
import { Row, Col, Divider, Input, Button, Menu } from "antd";
import Axios from "../../config/axios.setup";

const { TextArea } = Input;

class Stopaccountpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accountSelect: []
    };
  }
  getAccountList() {
    Axios.get("accountno-list")
      .then(response => {
        // console.log(response.data[0].accountNo);
        this.setState({ accounts: response.data });
        try {
          this.setState({ accountSelect: response.data[0].accountNo });
        } catch (err) {}
      })
      .catch(err => {
        console.error(err);
      });
  }
  componentDidMount() {
    this.getAccountList();
  }

  handleClickSelectedAccount = e => {
    const accountSelect = e.key;
    this.setState({ accountSelect: accountSelect });
  };

  handleSubmitDelete = async () => {
    let deleteaccount = this.state.accountSelect;
    let deleteCheck = await Axios.delete(`/delete-account/${deleteaccount}`)
      .then(result => result)
      .catch(err => {
        console.error(err);
      });
    this.getAccountList();
    console.log(deleteaccount);
  };

  onChangeTextArea = value => {};
  render() {
    return (
      <div>
        <Row type="flex" align="top">
          <Col span={6} offset={1}>
            <br />
            <h2>Delete Account</h2>
            <Row>
              <Menu
                style={{ width: "100%", border: "none" }}
                selectedKeys={this.state.accountSelect}
                onClick={this.handleClickSelectedAccount}
                mode="inline"
                theme="light"
              >
                {this.state.accounts.map(account => (
                  <Menu.Item value={account.accountNo} key={account.accountNo}>
                    {account.accountNo}
                  </Menu.Item>
                ))}
              </Menu>
            </Row>
          </Col>
          <Col span={1}>
            <Row
              type="flex"
              align="top"
              style={{ height: "70vh", marginTop: "5vh" }}
            >
              <Divider type="vertical" style={{ height: "50vh" }} />
            </Row>
          </Col>
          <Col>
            <br />
            <Row type="flex" align="top">
              <h3>Reason</h3>
            </Row>
            <Row>
              <TextArea
                style={{ width: "350px", height: "30vh" }}
                onChange={this.onChangeTextArea}
                placeholder="Controlled autosize"
              />
            </Row>
            <Row>
              <Button
                style={{ color: "rgba(255,255,255)", marginTop: "1vh" }}
                type="primary"
                size="small"
                onClick={this.handleSubmitDelete}
              >
                ยืนยัน
              </Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Stopaccountpage;
