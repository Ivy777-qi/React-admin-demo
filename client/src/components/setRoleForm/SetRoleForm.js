import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd';
import { siderConfig } from '../../config/siderConfig';


export default class SetRoleForm extends Component {
  state = {
    treeData: [],
    menus: [],
    checkedKeys: []
  }
  componentWillMount() {
    this.getTreeData(siderConfig);
    console.log(this.props.role.menus);
  }
  getTreeData = (siderConfig) => {
    // let treeData = [];
    let treeData = [{
      title: 'all',
      key: 'all',
      children: []
    }];//设置一个全面的权限
    let treeNode = {};
    siderConfig.map(item => {
      treeNode = {
        title: item.title,
        key: item.key,
        children: item.children ? this.getChildData(item.children) : null
      }
      treeData[0].children.push(treeNode);
    })
    console.log(treeData);
    this.setState({ treeData })
    if (this.props.role.menus.length !== 0) {
      this.setState({ checkedKeys: this.props.role.menus })
    }
  }
  getChildData = (list) => {
    let arr = [];
    let childNode = {};
    list.map(item => {
      childNode = {
        title: item.title,
        key: item.key,
        children: item.children ? this.getChildData(item.children) : null
      }
      arr.push(childNode);
    })
    return arr;
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys })
  };

  render() {
    const { role } = this.props;
    const { treeData, checkedKeys } = this.state;
    return (
      <Form >
        <Form.Item label='Role name' name='roleName' initialValue={role.name}>
          <Input disabled />
        </Form.Item>
        <Tree
          checkable
          defaultExpandAll={true}
          // onExpand={this.onExpand}
          onCheck={this.onCheck}
          //checkedKeys={checkedKeys}
          //onSelect={this.onSelect}
          checkedKeys={checkedKeys}
          treeData={treeData}
        />
      </Form>
    )
  }
}