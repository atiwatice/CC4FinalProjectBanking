import React from "react";
import { Button, Row, Col } from "antd";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Row
          style={{ height: "30vh" }}
          type="flex"
          justify="center"
          align="bottom"
        >
          <Col span={4} offset={11}>
            <Row type="flex" justify="center">
              <h1>
                <strong>Online Gaming</strong>
              </h1>
            </Row>
            <Row type="flex" justify="center">
              <h3>Your money is our money</h3>
            </Row>
            <Row type="flex" justify="center">
              <Button>Read more</Button>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Homepage;
