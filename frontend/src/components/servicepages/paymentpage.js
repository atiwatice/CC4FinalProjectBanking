import React, { Component } from "react";
import { Row, Col, Select, Input, Button, Menu, Divider } from "antd";
import Axios from "../../config/axios.setup";
import { moneyNotEnoughNotification } from "../notification/notification";

const { Option } = Select;
const { TextArea } = Input;
class Paymentpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accountSelect: [],
      selectPayment: "",
      refno: "",
      detail: "",
      amount: ""
    };
  }

  getAccountList() {
    Axios.get("accountno-list").then(response => {
      // console.log(response.data[0].accountNo);
      this.setState({ accounts: response.data });
      try{
      this.setState({ accountSelect: response.data[0].accountNo });}
      catch(err){}
    });
  }
  componentDidMount() {
    this.getAccountList();
  }
  handleClickSelectedAccount = e => {
    const accountSelect = e.key;
    this.setState({ accountSelect: accountSelect });
  };

  handleChangeSelect = value => {
    this.setState({ selectPayment: value });
  };

  handleSubmitPayment = () => {
    let payment = this.state.selectPayment;
    let refno = this.state.refno;
    let paymentMoney = this.state.amount;
    let accountNo = this.state.accountSelect;
    Axios.post("payment", {
      payment,
      refno,
      paymentMoney,
      accountNo
    }).then(result => result).catch(err => {console.log(err)
    moneyNotEnoughNotification()
    });
    this.getAccountList();
    this.setState({ refno: "", detail: "", amount: "" });
  };

  handleCancel = () => {
    this.getAccountList();
    this.setState({ refno: "", detail: "", amount: "" });
  };

  render() {
    return (
      <Row type="flex" align="top">
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

          <h3>Select Payment</h3>
          <Select
            defaultValue="rabbitLinePlay"
            style={{ width: 120 }}
            onSelect={this.handleChangeSelect}
          >
            <Option value="rabbitLinePlay">rabbitLinePlay</Option>
            <Option value="BLS">BLS</Option>
          </Select>
          <h3>หมายเลขอ้างอิง</h3>
          <Input
            style={{ width: "200px" }}
            placeholder="หมายเลขอ้างอิง"
            size="small"
            required
            value={this.state.refno}
            onChange={e => this.setState({ refno: e.target.value })}
          />
          <h3>จำนวนเงิน</h3>
          <Input
            style={{  width: "200px" }}
            placeholder="จำนวนเงิน"
            size="small"
            required
            value={this.state.amount}
            onChange={e => this.setState({ amount: e.target.value })}
          />
          <h3>บันทึกช่วยจำ</h3>
          <TextArea
            style={{ width: "400px", height: "20vh" }}
            value={this.state.detail}
            onChange={e => this.setState({ detail: e.target.value })}
            placeholder="Controlled autosize"
          />
          <Row type="flex" style={{ marginTop: "10px" }} justify="space-around">
            <Button
              style={{ color: "rgba(255,255,255)" }}
              type="primary"
              size="small"
              onClick={this.handleSubmitPayment}
            >
              ยืนยัน
            </Button>
            <Button
              style={{ color: "rgba(255,255,255)" }}
              type="primary"
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

export default Paymentpage;
