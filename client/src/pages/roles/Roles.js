import React, { Component } from 'react'
import { PAGE_SIZE } from '../../utlis/constants';
import { Card, Button, Table, Modal, Space } from 'antd';
import AddRoleForm from '../../components/addRoleForm/AddRoleForm';
import SetRoleForm from '../../components/setRoleForm/SetRoleForm';
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api/api';
import { formateDate } from '../../utlis/date';
import { getUsername } from '../../utlis/cookies';

export default class Roles extends Component {
  constructor(props) {
    super(props);
    this.addrole = React.createRef();
    this.updaterole = React.createRef();
  }
  state = {
    roleList: [],
    loading: false,
    total: 0,
    pageNum: 1,
    pageSize: PAGE_SIZE,
    showStatus: 0,
    selectedRows: [],
  }

  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.showRoleList();
  }
  initColumns = () => {
    // "_id": "5ca9eaa1b49ef916541160d3",
    // "name": "测试",
    // "create_time": 1554639521749,
    // "__v": 0,
    // "auth_time": 1558679920395,
    // "auth_name": "test007"
    this.columns = [
      {
        title: 'Role Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: 'Authorization time',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: 'Authorizer',
        dataIndex: 'auth_name'
      }
    ];

  }
  setUser = (role) => {
    this.setState({ showStatus: 2 })
  }
  handleCancel = () => {
    this.setState({ showStatus: 0 })
  }

  showRoleList = async () => {
    this.setState({
      loading: true
    })
    const result = await reqRoles();
    if (result.status === 0) {
      console.log(result);
      this.setState({
        roleList: result.data,
        loading: false,
        total: result.data.length
      })
    }

  }
  addRole = async () => {
    this.setState({ showStatus: 0 });
    console.log(this.addrole.current.state.roleName);
    const result = await reqAddRole(this.addrole.current.state.roleName);
    if (result.status === 0) {
      this.showRoleList();
    }
  }
  onChangePage = page => {
    console.log(page);
    this.setState({
      pageNum: page,
    });
  };

  setRole = async () => {
    this.setState({ showStatus: 0 })
    const { selectedRows } = this.state;
    let role = {};
    let obj = selectedRows;
    role._id = selectedRows[0]._id;
    role.menus = this.updaterole.current.state.checkedKeys;
    role.auth_time = Date.now();
    role.auth_name = getUsername();
    console.log(role);
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      this.showRoleList();

      obj[0].menus = role.menus; //及时更新menus
      this.setState({
        selectedRows: obj
      })
      console.log(this.state.selectedRows);
    }
  }

  render() {
    const { roleList, loading, showStatus, pageSize, selectedRows } = this.state;
    const title = (
      <Space size="middle">
        <Button type="primary" onClick={() => this.setState({ showStatus: 1 })} >
          Add new role
      </Button>
        <Button type="primary" onClick={() => this.setUser()} disabled={selectedRows.length === 1 ? false : true}>
          Set role
     </Button>
      </Space>
    )


    return (
      <>
        <Card title={title} bordered={false}>
          <Table
            rowKey='_id'
            columns={this.columns}
            loading={loading}
            dataSource={roleList}
            pagination={{ defaultPageSize: pageSize }}//自主分页
            bordered
            rowSelection={{
              type: 'radio',
              selectedRowKeys: roleList._id,
              onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows);
                this.setState({
                  selectedRows
                })
              }
            }}
          />
          {/* <Pagination
            current={pageNum}
            total={total}
            defaultPageSize={PAGE_SIZE}
            showQuickJumper
            showTotal={total => `Total ${total} items`}
            style={{ float: 'right', marginTop: 10 }}
            onChange={this.onChangePage}
          /> */}
        </Card>
        <Modal
          title={"Add new role"}
          visible={showStatus === 1}
          onOk={this.addRole}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <AddRoleForm
            ref={this.addrole}
          />
        </Modal>
        <Modal
          title={"Set role"}
          visible={showStatus === 2 && selectedRows.length === 1}
          onOk={this.setRole}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <SetRoleForm
            ref={this.updaterole}
            role={selectedRows[0]}
          />
        </Modal>

      </>
    )
  }

}