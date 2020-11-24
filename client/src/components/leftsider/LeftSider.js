import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { siderConfig } from '../../config/siderConfig';
import { getUser, getUsername } from '../../utlis/cookies';
import { HomeOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;
class LeftSider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKey: ''
    }
  }

  componentWillMount() {
    this.getOpenkey();//设置默认打开项
    this.data = getUser();
    console.log(this.data);
  }

  getOpenkey = () => {
    let openKey = [];
    siderConfig.map(item => {
      if (item.children) {
        openKey.push(item.key);

      }
    })
    this.setState({ openKey });
  }

  getSiderMenu = () => {
    console.log(this.data.role.menus);
    let menus = this.data.role.menus;

    if (menus.length !== 0 || getUsername() === 'admin') {
      console.log(121231313);
      return siderConfig.map(item => {
        if (item.key === '/home') {
          return (
            <Menu.Item key='/home' icon={<HomeOutlined />}>
              <Link to='./'><span>Home</span></Link>
            </Menu.Item>
          )
        }
        if (!item.children) {

          if (menus.indexOf(item.key) !== -1 || getUsername() === 'admin') {

            return (
              <Menu.Item key={item.key} icon={item.icon}>
                <Link to={item.key}><span>{item.title}</span></Link>
              </Menu.Item>
            )
          }

        } else {
          if (menus.indexOf(item.key) !== -1 || getUsername() === 'admin') {
            console.log(item);

            return (
              <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {this.getSiderChildren(item.children)}
              </SubMenu>
            )
          }
        }
      })
    } else {
      return (
        <Menu.Item key='/home' icon={<HomeOutlined />}>
          <Link to='./'><span>Home</span></Link>
        </Menu.Item>
      )

    }

  }

  getSiderChildren = (item) => {
    return item.map(list => {
      // console.log(item);
      return (
        <Menu.Item key={list.key} icon={list.icon}>
          <Link to={list.key}><span>{list.title}</span></Link>
        </Menu.Item>
      )
    })
  }
  render() {
    const { openKey } = this.state;
    //render比setState先执行,所以第一次没有值,通过openkey有值之后进行回调
    if (openKey) {
      return (
        <Sider trigger={null} collapsible collapsed={this.props.collapsed} >
          <div className="logo" >Admin</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={openKey}>
            {
              this.getSiderMenu()
            }
          </Menu>
        </Sider>
      )
    }

  }
}
export default LeftSider;