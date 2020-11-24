import React, { Component } from 'react'
import { Select, Form, Input } from 'antd'
const { Option } = Select;

/*
后台管理的柱状图路由组件
 */
export default class UserForm extends Component {
  state = {
    initialName: ''
  }
  formRef = React.createRef();

  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  getRoleList = () => {
    return ( //这里需要return
      this.props.roles && this.props.roles.map(item =>
        (
          <Option key={item._id} value={item._id}>{item.name}</Option>
        ))
    )

  }

  render() {
    const { showStatus, user } = this.props;
    let item = user;
    if (showStatus === 1) { //add不显示默认值
      item = {}
    }
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        ref={this.formRef}
        layout="horizontal"
        preserve={false}
      >
        <Form.Item label="Username" name='username' required initialValue={item.username}>
          <Input placeholder='please enter the name' />
        </Form.Item>
        {
          showStatus === 1 ?
            <Form.Item label="Password" name='password'
              rules={[
                { required: true, message: 'Please input 4-12 digits password!' },
                { min: 4, },
                { max: 12, },
              ]}>
              <Input placeholder='please enter the password' />
            </Form.Item> : ''
        }

        <Form.Item label="Phone" name='phone' required initialValue={item.phone}>
          <Input placeholder='please enter the phone number' />
        </Form.Item>
        <Form.Item label="Email" name='email' required initialValue={item.email}
          rules={[
            {
              type: 'email',
            },
          ]}>
          <Input placeholder='please enter the email' />
        </Form.Item>
        <Form.Item label="Role" name='role_id' required initialValue={item.role_id}>
          <Select placeholder='please select' >
            {this.getRoleList()}
          </Select>
        </Form.Item>
      </Form>
    )
  }

}