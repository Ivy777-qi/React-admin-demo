import React, { Component } from 'react'
import { reqCategory } from '../../api/api'

import LinkButton from '../../components/linkbutton/LinkButton'
import { Card, Form } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utlis/constants';



export default class Detail extends Component {

  state = {
    categoryName: '',
    pCategoryName: ''

  }
  componentDidMount() {
    if (this.props.location.state) {//获取list挑战到这里的id参数
      this.getCascader(this.props.location.state.product);
    }
  }
  getCascader = async (product) => {
    const { categoryId, pCategoryId } = product;
    //通过Id来获取种类名称
    if (pCategoryId === '0') {
      const result = await reqCategory(categoryId);
      console.log(result);
      if (result.status === 0) {
        this.setState({
          pCategoryName: result.data.name
        })
      }
    } else {
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])//同时进行请求
      console.log(results);
      if (results[0].status === 0 && results[1].status === 0) {
        this.setState({
          pCategoryName: results[0].data.name,
          categoryName: results[1].data.name
        })
      }
    }

  }
  render() {
    const { name, desc, price, detail, imgs } = this.props.location.state.product;
    const { pCategoryName, categoryName } = this.state;

    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 10,
      },
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>
        <span>Detail</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form {...layout} name="detail">
          <Form.Item
            name='name'
            label="Name"
          >
            <span>{name}</span>
          </Form.Item>
          <Form.Item
            name='desc'
            label='Description'

          >
            <span>{desc}</span>
          </Form.Item>
          <Form.Item
            name='price'
            label="Price"
          >
            <span>{'$' + price}</span>
          </Form.Item>
          <Form.Item name='category' label="Category" >
            <span>{pCategoryName} {categoryName === '' ? '' : '-->' + categoryName}</span>
          </Form.Item>
          <Form.Item name='imgs' label="Picture">
            {
              imgs.map(item => (
                <img
                  key={item}
                  src={BASE_IMG_URL + item}
                  style={{
                    width: '150px',
                    height: '150px',
                    marginRight: '10px'
                  }}
                  alt="img"
                />
              ))
            }
          </Form.Item>
          <Form.Item name='detail' label="Detail" >
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}