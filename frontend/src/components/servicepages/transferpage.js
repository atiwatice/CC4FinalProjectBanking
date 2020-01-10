import React, { Component } from "react";
import { Row, Col, Divider, Input, Button, Menu } from "antd";
import Axios from "../../config/axios.setup";
import { moneyNotEnoughNotification } from "../notification/notification";

class Transferpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accountSelect: [],
      toAccountNo: "",
      amount: ""
    };
  }

  getAccountList() {
    Axios.get("accountno-list").then(response => {
      // console.log(response.data[0].accountNo);
      this.setState({ accounts: response.data });
      try {
        this.setState({ accountSelect: response.data[0].accountNo });
      } catch (err) {}
    });
  }
  componentDidMount() {
    this.getAccountList();
  }

  handleClickSelectedAccount = e => {
    const accountSelect = e.key;
    this.setState({ accountSelect: accountSelect });
  };
  handleSubmitTranferTo = () => {
    let accountNo = this.state.accountSelect;
    let transferTo = this.state.toAccountNo;
    let transferMoney = this.state.amount;
    Axios.post("/tranferTo", { accountNo, transferTo, transferMoney })
      .then(result => result)
      .catch(err => {
        console.error(err);
        moneyNotEnoughNotification();
      });
    this.setState({ toAccountNo: "", amount: "" });
  };

  handleCancel = () => {
    this.setState({ toAccountNo: "", amount: "" });
  };

  render() {
    return (
      <Row type="flex">
        <Col span={6} offset={1}>
          <br />
          <Row type="flex" align="top">
            <h3>From: Account</h3>
            <Menu
              style={{ width: "100%", border: "none" }}
              selectedKeys={this.state.accountSelect}
              onClick={this.handleClickSelectedAccount}
              mode="inline"
              theme="light"
            >
              {this.state.accounts.map(account => (
                <Menu.Item key={account.accountNo}>
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
            <h3>From: Account</h3>
          </Row>
          <Row>
            <h5>เลขบัญชี</h5>
            <Input
              style={{  width: "200px" }}
              placeholder="เลขบัญชี"
              size="small"
              required
              value={this.state.toAccountNo}
              onChange={e => this.setState({ toAccountNo: e.target.value })}
            />
          </Row>
          <Row>
            <h5>จำนวนเงิน</h5>
            <Input
              style={{ width: "200px" }}
              placeholder="จำนวนเงิน"
              size="small"
              required
              value={this.state.amount}
              onChange={e => this.setState({ amount: e.target.value })}
            />
          </Row>
          <Row type="flex" style={{ marginTop: "10px" }} justify="space-around">
            <Button
              style={{ color: "rgba(255,255,255)" }}
              type="primary"
              onClick={this.handleSubmitTranferTo}
              size="small"
            >
              ยืนยัน
            </Button>
            <Button
              style={{ color: "rgba(255,255,255)" }}
              type="primary"
              // htmlType=""
              size="small"
              onClick={this.handleCancel}
            >
              ยกเลิก
            </Button>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default Transferpage;
