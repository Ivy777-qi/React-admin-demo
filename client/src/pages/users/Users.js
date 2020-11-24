import React, { Component } from 'react'
import { reqRoles, reqAddOrUpdateUser, reqUsers, reqDeleteUser } from '../../api/api';
import { PAGE_SIZE } from '../../utlis/constants';
import LinkButton from '../../components/linkbutton/LinkButton';
import { Card, Button, Table, Modal, Space, message } from 'antd';
import UserForm from '../../components/userForm/UserForm';
import { formateDate } from '../../utlis/date';


export default class Users extends Component {
  constructor(props) {
    super(props);
    this.adduser = React.createRef();
    this.updateuser = React.createRef();
  }

  state = {
    loading: false,
    pageSize: PAGE_SIZE,
    showStatus: 0,
    users: [],
    roles: [],
    roleName: [],
    user: {}

  }

  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getUserList();
    this.getRole();
  }
  getRole = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      this.setState({
        roles: result.data
      })
    }
  }
  initColumns = () => {
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'username',
        key: 'name',
        width: '15%',//设置列宽
      },
      {
        title: 'E-mail',
        dataIndex: 'email',
        key: 'email',
        width: '20%',//设置列宽
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '20%',//设置列宽
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
        key: 'create_time',
        width: '20%',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: 'Role',
        dataIndex: 'role_id',
        key: 'role',
        width: '10%',//设置列宽
        render: (role_id) => this.state.roleName[role_id]
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (user) => (//user来自dataIndex里面,没有就可以随便设置
          <Space size="middle">
            <LinkButton onClick={() => this.editUser(user)}>Edit</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
          </Space>
        ),
      },
    ];

  }
  deleteUser = async (user) => {
    Modal.confirm({
      title: `Confirm to delete ${user.username} ?`, //
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success('Delete success!')
          this.getUserList();
        }
      }
    })
  }
  getUserList = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.getRoleName(roles);
      // data.role_id = this.state.roleName;
      console.log(users, roles);
      this.setState({
        users,
        roles
      })
      // console.log(this.state.users);
    }
  }
  ///生成一个和role_id一样的数组
  getRoleName = (roles) => {
    let arr = [];
    roles && roles.map(item =>
      arr[item._id] = item.name
    )
    this.setState({
      roleName: arr
    })
    //console.log(roleName);
    //return roleName
  }
  handlerUser = async () => {
    const { user } = this.state;
    this.form.current.validateFields().then(async (values) => {
      this.setState({
        showStatus: 0,
      });
      console.log(values, user);
      if (user) {
        values._id = user._id;
      }
      const result = await reqAddOrUpdateUser(values);
      if (result.status === 0) {
        message.success('Operation success!');
        this.getUserList();
      }
    }).catch(err => {
      console.log(err);
    })

  }

  editUser = (user) => {
    console.log(user);
    this.setState({
      showStatus: 2,
      user
    })
  }

  handleCancel = () => {
    this.setState({ showStatus: 0 })
  }
  render() {
    const { users, loading, showStatus, pageSize, roles, user } = this.state;
    const title = (
      //add 清空user,避免_id问题
      <Button type="primary" onClick={() => this.setState({ user: {}, showStatus: 1 })} >
        Add new User
      </Button>
    )


    return (
      <>
        <Card title={title} bordered={false}>
          <Table
            rowKey='_id'
            columns={this.columns}
            loading={loading}
            dataSource={users}
            pagination={{ defaultPageSize: pageSize }}//自主分页
            bordered
          />
        </Card>
        <Modal
          title={showStatus === 1 ? "Add user" : "update user"}
          visible={showStatus}
          onOk={this.handlerUser}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <UserForm
            setForm={(form) => { this.form = form }}
            showStatus={showStatus}
            roles={roles}
            user={user}
          />
        </Modal>

      </>
    )
  }

}