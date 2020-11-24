import React, { Component } from 'react';
import PieLineChart from '../../components/pieLineChart/PieLineChart';
import { Card, Col, Row, Progress, Timeline } from 'antd';
import {
  ShoppingCartOutlined,
  MailOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons';
const { Meta } = Card;

export default class HomeContent extends Component {
  fourWays = () => {
    let imgSrc = ["mail", "chat", "cart", "heart"];
    let imgName = ["Mails", "Dialogues", "Carts", "Likes"];
    let imgIcon = [<MailOutlined style={{ color: 'green', fontSize: "50px", padding: "5px 0 0 30px" }} />,
    <MessageOutlined style={{ color: 'blue', fontSize: "50px", padding: "5px 0 0 30px" }} />,
    <ShoppingCartOutlined style={{ color: 'purple', fontSize: "50px", padding: "5px 0 0 30px" }} />,
    <LikeOutlined style={{ color: 'red', fontSize: "50px", padding: "5px 0 0 30px" }} />];
    let count = ["1342", "987", "567", "874"];
    return (
      imgSrc.map((item, index) => {
        return (
          <Col md={6} key={item}>
            <Card style={{ cursor: 'pointer', marginBottom: 16 }}>
              <Meta
                style={{ fontSize: 25, textAlign: 'center' }}
                avatar={imgIcon[index]}
                title={imgName[index]}
                description={count[index]}
              />
            </Card>
          </Col>
        )
      })
    )

  }
  render() {
    return (
      <div className='tool'>
        <Row gutter={8}>
          {this.fourWays()}
        </Row>
        <Card
          style={{ marginBottom: 16 }}
          bodyStyle={{ padding: 0 }}>
          <PieLineChart ></PieLineChart>
        </Card>
        <Row gutter={16} >
          <Col md={12}>
            <Card
              title='Project process'
              style={{ margin: '20, 0, 0, 20' }}
              bodyStyle={{ padding: 0 }}>
              <Row gutter={16} style={{ marginLeft: 50 }}>
                <Col span={12}>
                  <div>Project A </div>
                  <Progress type="dashboard" percent={25} width={125} id='pro1' strokeColor='red' />
                </Col>
                <Col span={12}>
                  <div>Project B</div>
                  <Progress type="dashboard" percent={50} width={125} id='pro2' />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginLeft: 50 }}>
                <Col span={12}>
                  <div>Project C</div>
                  <Progress type="dashboard" percent={75} width={125} id='pro3' strokeColor='yellow' />
                </Col>
                <Col span={12}>
                  <div>Project D</div>
                  <Progress type="dashboard" percent={100} width={125} format={() => 'Done'} id='pro4' />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col md={12}>
            <Card style={{ marginBottom: 16 }}>
              <div>
                <h3>Project timeline</h3>
              </div>
              <div className="timeline">
                <Timeline>
                  <Timeline.Item color="green">Create a services site 2020-09-01</Timeline.Item>
                  <Timeline.Item color="green">Create a services site 2020-09-10</Timeline.Item>
                  <Timeline.Item color="red">
                    <p>Solve initial network problems 1</p>
                    <p>Solve initial network problems 2</p>
                    <p>Solve initial network problems 3 2020-10-01</p>
                  </Timeline.Item>
                  <Timeline.Item>
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2020-10-10</p>
                  </Timeline.Item>
                  <Timeline.Item color="gray">
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2020-11-01</p>
                  </Timeline.Item>
                  <Timeline.Item color="gray">
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2020-12-01</p>
                  </Timeline.Item>
                </Timeline>,
              </div>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }

}

