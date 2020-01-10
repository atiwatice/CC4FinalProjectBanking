import React, { Component } from "react";
import { Row, Col, Tabs, Divider, Button, Input, Table, Tag } from "antd";
import Axios from "../../config/axios.setup";
import { Menu, Icon } from "antd";
var moment = require("moment");
const { TabPane } = Tabs;

class Accountpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      accountSelect: [],
      tabSelect: "balance",
      accountsToday: [],
      accountNo: "",
      addmoney: ""
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
    Axios.get("accountno-list-today").then(response => {
      this.setState({ accountsToday: response.data });
    });
  }

  componentDidMount() {
    this.getAccountList();
  }

  handleClickSelectedAccount = e => {
    const accountSelect = e.key;
    this.setState({ accountSelect: accountSelect });
  };
  onChange = e => {
    this.setState({ tabSelect: e });
  };

  balanceEachAccount() {
    const accountNo = this.state.accountSelect;
    const accountArr = this.state.accounts.filter(
      account => account.accountNo == accountNo
    );
    const balance = accountArr.map(value => value.balance);
    return balance;
  }

  handleSubmitAddmoney = async () => {
    const accountNo = this.state.accountNo;
    const addmoney = this.state.addmoney;
    await Axios.post("/addMoney", { accountNo, addmoney })
      .then(result => {
        this.getAccountList();
        this.balanceEachAccount();
      })
      .catch(err => {
        console.error(err);
      });
    // await this.getAccountList();

    this.setState({ accountNo: "", addmoney: "" });
  };
  handleCancel = () => {
    this.setState({ toAccountNo: "", amount: "" });
  };

  render() {
    const columns = [
      {
        title: "Type",
        dataIndex: "type"
      },
      {
        title: "From/To",
        dataIndex: "fromTo"
      },
      {
        title: "Amount",
        dataIndex: "amount"
      },
      {
        title: "Time",
        dataIndex: "time"
      }
    ];
    const dataToday = [];
    let accountSelectToday = this.state.accountsToday.filter(
      account => account.accountNo == this.state.accountSelect
    );
    let tranferringsToday = accountSelectToday.map(
      tranferring => tranferring.tranferrings
    );
    let counter = tranferringsToday.map(arr => arr.length);
    let inputHistorydata = tranferringsToday.forEach(account => {
      for (let i = 0; i < counter; i++) {
        dataToday.push({
          key: account[i].uid,
          type: account[i].type,
          fromTo: account[i].from_to,
          amount: account[i].amount,
          time: moment(account[i].updatedAt).format("MM-DD-YYYY HH:mm")
        });
      }
    });

    const dataAll = [];
    let accountSelectAll = this.state.accounts.filter(
      account => account.accountNo == this.state.accountSelect
    );
    let tranferringsAll = accountSelectAll.map(
      tranferring => tranferring.tranferrings
    );
    let counterAll = tranferringsAll.map(arr => arr.length);
    let inputHistorydataAll = tranferringsAll.forEach(account => {
      for (let j = 0; j < counterAll; j++) {
        dataAll.push({
          key: account[j].uid,
          type: account[j].type,
          fromTo: account[j].from_to,
          amount: account[j].amount,
          time: moment(account[j].updatedAt).format("MM-DD-YYYY HH:mm")
        });
      }
    });

    return (

      <Row type="flex" >
        <Col span={5} offset={1}>
          <br />
          <Row type="flex" align="top">
            <h3>Account No</h3>
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
            <Tabs
              onChange={this.onChange}
              activeKey={this.state.tabSelect}
              type="card"
            >
              <TabPane tab="Balance" key="balance">
                <div
                  style={{
                    backgroundColor: "",
                    width: "50vh",
                    height: "30vh",
                    borderRadius: "40px 40px 40px 40px"
                  }}
                >
                  <Row>
                    <Col offset={2} style={{ marginTop: "2vh" }}>
                      Balance : {this.balanceEachAccount()}
                    </Col>
                  </Row>
                  <Row>
                    <h5 style={{ marginTop: "15px" }}>เติมเงินเข้าบัญชี</h5>
                    <Input
                      style={{  width: "300px" }}
                      placeholder="เลขบัญชี"
                      size="small"
                      value={this.state.accountNo}
                      onChange={e =>
                        this.setState({ accountNo: e.target.value })
                      }
                      required
                    />
                  </Row>
                  <Row>
                    <h5>จำนวนเงิน</h5>
                    <Input
                      style={{  width: "300px" }}
                      placeholder="จำนวนเงิน"
                      size="small"
                      value={this.state.addmoney}
                      onChange={e =>
                        this.setState({ addmoney: e.target.value })
                      }
                      required
                    />
                  </Row>

                  <Row
                    type="flex"
                    style={{ marginTop: "10px" }}
                    justify="space-around"
                  >
                    <Button
                      style={{ color: "rgba(255,255,255)" }}
                      type="primary"
                      size="small"
                      onClick={this.handleSubmitAddmoney}
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
                </div>
              </TabPane>
              <TabPane tab="Today Statement" key="todayStatement">
                <div
                  style={{
                    width: "70vh",
                    height: "30vh",
                    borderRadius: "40px 40px 40px 40px"
                  }}
                >
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={dataToday}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: "30vh" }}
                    align="center"
                  />
                </div>
              </TabPane>
              <TabPane tab="History Statement" key="historyStatement">
                <div
                  style={{
                    width: "70vh",
                    height: "30vh",
                    borderRadius: "40px 40px 40px 40px"
                  }}
                >
                  <Table
                    size="small"
                    columns={columns}
                    dataSource={dataAll}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: "30vh" }}
                    align="center"
                  />
                </div>
              </TabPane>
            </Tabs>
          </Row>
        </Col>
      </Row>

    );
  }
}

export default Accountpage;
