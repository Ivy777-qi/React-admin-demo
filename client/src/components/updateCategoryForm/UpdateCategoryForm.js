import React, { Component } from 'react'
import { Form, Input } from 'antd'
/*
后台管理的柱状图路由组件
 */
export default class UpdateCategoryForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }



  componentWillMount() {
    this.props.setForm(this.formRef)
  }


  render() {
    const { singleItem } = this.props;
    console.log(singleItem);
    //console.log(this.formRef);
    // if (this.formRef.current != null) {//进入的第一次为null
    //   this.formRef.current.setFieldsValue({ categoryName: singleItem });
    // }

    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        ref={this.formRef}
        layout="horizontal"
        preserve={false}
      >
        <Form.Item name='categoryName' initialValue={singleItem}>
          <Input placeholder='please enter subcategory' />
          {/* {
            getFieldDecorator('categoryName', {
              initialValue: singleItem,
              rules: [
                { required: true, message: 'please enter subcategory' }
              ]
            })(
              
            )
          } */}
        </Form.Item>
      </Form>
    )
  }

}

