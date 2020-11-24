import React from 'react';
import './home.css';
import LeftSider from '../../components/leftsider/LeftSider';
import LinkButton from '../../components/linkbutton/LinkButton'
import { reqweather } from '../../api/api'
import { formateDate } from '../../utlis/date';
import ContentMenu from '../../components/admin/ContentMenu';
import HomeContent from '../../components/homeContent/HomeContent';
import { getUsername, setToken } from '../../utlis/cookies';
import { Layout, Modal, Card } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Meta } = Card;
const { Header, Content } = Layout;
class Home extends React.Component {

  state = {

    nowTime: formateDate(Date.now()),
    collapsed: false,
    weatherPicture: '',
    weather: '', // 天气的文本
  };

  componentDidMount() {
    this.getweather();
    this.getDate();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  getweather = async () => {
    const { main, icon } = await reqweather('Auckland');
    this.setState({
      weather: main,
      weatherPicture: icon
    });
    console.log(this.state.weather);
    console.log(this.state.weatherPicture);

  }
  getDate = () => {
    this.timer = setInterval(() => {
      const nowTime = formateDate(Date.now());
      this.setState({ nowTime })
    }, 1000)
  }
  getTitle = () => {
    // 得到当前请求路径
    let path = this.props.location.pathname;
    if (path === '/') {
      path = 'Home';
    }
    else {
      path = path.split('/')[1];
      path = path.replace(path[0], path[0].toUpperCase());//首字母大写
    }
    return path;
  }


  logout = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Sign out?',
      okText: 'ok',
      cancelText: 'cancel',
      onOk: () => {
        setToken('');
        // 跳转到login
        this.props.history.replace('/login')
      }
    });
  }
  render() {
    const title = this.getTitle();

    const { weather, weatherPicture, nowTime, collapsed } = this.state;
    return (
      <Layout className='home-wrapper'>
        <LeftSider collapsed={collapsed} />
        <Layout className="site-layout">
          <Header className="site-layout-background header" style={{ padding: 0 }}>
            <div className='header-left'>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
              <div className='title'>{title}</div>
            </div>
            <div className='loginout header-right'>
              <LinkButton onClick={this.logout} >Sign out</LinkButton>
            </div>
            <div className='header-right'>欢迎, {getUsername()}</div>
            <div className='weather'>
              {nowTime}
              <img src={"http://api.openweathermap.org/img/w/" + weatherPicture + ".png"} alt="weather" />
              {weather}
            </div>
          </Header>
          <Content className="site-layout-background">
            {
              title === 'Home' ? <HomeContent /> : <ContentMenu />
            }
          </Content>
        </Layout>
      </Layout>
    );
  }
}


export default Home;