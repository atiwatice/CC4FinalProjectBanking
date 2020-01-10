import React, { Component } from "react";
import { Row, Col, Tabs, Divider, Select, Table, Input, Button } from "antd";
import Axios from "../../config/axios.setup";
var moment = require("moment");
const { Option } = Select;
const { TabPane } = Tabs;
class Adminpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersToday: [],
      userSelect: [],
      accountAllFromuserSelect: [],
      accountSelect: [],
      tabSelect: "balance",
      createAccount: "",
      userId: ""
    };
  }

  getAccountList() {
    Axios.get("userList")
      .then(response => {
        let users = response.data;
        users = users.filter(user => user.role !== "admin");
        let userSelect = users[0].username;

        this.setState({
          users: users,
          userSelect: userSelect
        });
      })
      .catch(err => console.log(err));

    Axios.get("userListToday")
      .then(response => {
        let users = response.data;
        users = users.filter(user => user.role !== "admin");
        let userSelect = users[0].username;

        this.setState({
          usersToday: users
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getAccountList();
  }

  onChangeTap = key => {
    this.setState({ tabSelect: key });
  };
  handleChangeSelectUser = value => {
    this.setState({ userSelect: value });
    let userId = "";
    let user = this.state.users.filter(user => user.username == value);
    try {
      userId = user[0].id;
    } catch (err) {}
    let accountAll = [];
    let account = user.map(account => account.accounts);
    let counter = account.map(account => account.length);
    let inputData = account.forEach(account => {
      for (let i = 0; i < counter; i++) {
        accountAll.push(account[i].accountNo);
      }
      this.setState({ accountAllFromuserSelect: accountAll, userId: userId });
    });
  };
  handleChangeSelectAccount = value => {
    this.setState({ accountSelect: value });
  };

  balanceEachAccount() {
    let balance = "";
    const accountNo = this.state.accountSelect;
    const userSelect = this.state.userSelect;
    let user = this.state.users.filter(user => user.username == userSelect);
    let account = user.map(account => account.accounts);
    let counter = account.map(account => account.length);
    let inputData = account.forEach(account => {
      for (let i = 0; i < counter; i++) {
        if (account[i].accountNo == accountNo) {
          balance = account[i].balance;
        }
      }
    });
    return balance;
  }

  handleSubmitCreateAccount = () => {
    let id = this.state.userId;
    let accountNo = this.state.createAccount;
    Axios.post("/create-account", { id, accountNo });
    this.setState({ createAccount: "" });
  };

  handleCancel = () => {
    this.setState({ createAccount: "" });
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
    const dataAll = [];
    const accountNo = this.state.accountSelect;
    const userSelect = this.state.userSelect;
    let user = this.state.users.filter(user => user.username == userSelect);
    let account = user.map(account => account.accounts);
    let counter = account.map(account => account.length);
    let inputData = account.forEach(account => {
      for (let i = 0; i < counter; i++) {
        if (account[i].accountNo == accountNo) {
          let tranfers = account[i].tranferrings;
          let countertranfer = tranfers.length;
          for (let j = 0; j < countertranfer; j++) {
            dataAll.push({
              key: j,
              type: tranfers[j].type,
              fromTo: tranfers[j].from_to,
              amount: tranfers[j].amount,
              time: moment(tranfers[j].updatedAt).format("MM-DD-YYYY HH:mm")
            });
          }
        }
      }
    });
    let userToday = this.state.usersToday.filter(
      user => user.username == userSelect
    );
    let accountToday = userToday.map(account => account.accounts);
    let counterToday = accountToday.map(account => account.length);
    let inputDataToday = accountToday.forEach(account => {
      for (let k = 0; k < counterToday; k++) {
        if (account[k].accountNo == accountNo) {
          let tranfers = account[k].tranferrings;
          let countertranfer = tranfers.length;
          for (let l = 0; l < countertranfer; l++) {
            dataToday.push({
              key: l,
              type: tranfers[l].type,
              fromTo: tranfers[l].from_to,
              amount: tranfers[l].amount,
              time: moment(tranfers[l].updatedAt).format("MM-DD-YYYY HH:mm")
            });
          }
          console.log(countertranfer);
        }
      }
    });
    return (
      <Row type="flex">
        <Col offset={1} span={6}>
          <br />
          <Row type="flex" align="top">
            <h3>Select User</h3>
            <Select
              defaultValue=""
              style={{ width: 120 }}
              onSelect={this.handleChangeSelectUser}
            >
              {this.state.users.map(user => (
                <Option key={user.id} value={user.username}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Row>
          <Row type="flex" align="top">
            <h3>Select Account</h3>
            <Select
              defaultValue={this.state.accountSelect}
              style={{ width: 120 }}
              onSelect={this.handleChangeSelectAccount}
            >
              {this.state.accountAllFromuserSelect.map(account => (
                <Option key={account} value={account}>
                  {account}
                </Option>
              ))}
            </Select>
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
              onChange={this.onChangeTap}
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
                    <Col offset={2} style={{ marginTop: "2vh" }} span={8}>
                      <Row>Balance : {this.balanceEachAccount()}</Row>
                      <Row style={{ marginTop: "1vh" }}>
                        <h5>Create Account</h5>
                        <Input
                          style={{  width: "200px" }}
                          placeholder="จำนวนเงิน"
                          size="small"
                          required
                          value={this.state.createAccount}
                          onChange={e =>
                            this.setState({ createAccount: e.target.value })
                          }
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
                          onClick={this.handleSubmitCreateAccount}
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
                </div>
              </TabPane>
              <TabPane tab="Today Statement" key="todayStatement">
                <div
                  style={{
                    width: "65vh",
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
                    width: "65vh",
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

export default Adminpage;
