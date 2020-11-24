import React, { Component } from 'react'
import { Input, Form } from 'antd';


export default class AddRoleForm extends Component {

  state = {
    roleName: ''
  }
  render() {
    return (
      <Form>
        <Form.Item label='Role name' name='roleName'>
          <Input placeholder='please enter the role name' onChange={(e) => this.setState({ roleName: e.target.value })} />
        </Form.Item>
      </Form>
    )
  }
}