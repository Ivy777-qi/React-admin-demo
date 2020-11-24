import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'


const { Option } = Select;
/*
后台管理的柱状图路由组件
 */
export default class AddCategoryForm extends Component {
  formRef = React.createRef();

  componentWillMount() {
    this.props.setForm(this.formRef)
  }
  render() {
    const { categories, parentId } = this.props;
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        ref={this.formRef}
        layout="horizontal"
      >
        <Form.Item name="parentId" initialValue={parentId}>
          <Select placeholder="The first level category" >
            <Option value='0'>The first level category</Option>
            {
              categories && categories.map(item =>
                (<Option value={item._id}>{item.name}</Option>))
            }
          </Select>
        </Form.Item>
        <Form.Item name="categoryName">
          <Input placeholder='please enter the category name' />
        </Form.Item>
      </Form>
    )
  }

}
