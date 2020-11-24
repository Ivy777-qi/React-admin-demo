import React, { Component } from 'react'
import { Select, Form, Input } from 'antd'

/*
后台管理的柱状图路由组件
 */
export default class UpdateUser extends Component {
  render() {
    const { showStatus } = this.props;
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        ref={this.formRef}
        layout="horizontal"
        preserve={false}
      >
        <Form.Item label="Username" name='username' >
          <Input placeholder='please enter the name' />
        </Form.Item>
        <Form.Item label="Phone" name='phone' >
          <Input placeholder='please enter the phone number' />
        </Form.Item>
        <Form.Item label="Email" name='email' >
          <Input placeholder='please enter the email' />
        </Form.Item>
        <Form.Item label="Role" name='role' >
          <Select placeholder='please select' />
        </Form.Item>
      </Form>
    )
  }

}