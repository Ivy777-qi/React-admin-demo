import React from 'react';
import './login.css'
import { Form, Input, Button, message } from 'antd';
import { reqLogin } from '../../api/api'
import { setToken, setUsername, setUser } from '../../utlis/cookies';
import { ROOT_PATH } from '../../utlis/constants';
import Circle from '../../components/circle/Circle';


class Login extends React.Component {

  onFinish = async (values) => {
    console.log('Success:', values);
    const { username, password } = values
    const result = await reqLogin(username, password);
    console.log(result);
    if (result.status === 0) {
      setToken(values.password);
      setUsername(values.username);
      setUser(result.data);
      console.log(result.data);
      message.success('Login Success');
      // 跳转到管理界面 (不需要再回退回到登陆)
      this.props.history.replace('/');
    } else {
      message.error('Sorry, the password you supplied is incorrect. Please try again.')
    }

  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  getOption = () => {
    const option = {
      backgroundColor: '#000',
      globe: {
        baseTexture: ROOT_PATH + "/data-gl/asset/world.topo.bathy.200401.jpg",
        heightTexture: ROOT_PATH + "/data-gl/asset/world.topo.bathy.200401.jpg",
        displacementScale: 0.04,
        shading: 'realistic',
        environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
        realisticMaterial: {
          roughness: 0.9
        },
        postEffect: {
          enable: true
        },
        light: {
          main: {
            intensity: 5,
            shadow: true
          },
          ambientCubemap: {
            texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
            diffuseIntensity: 0.2
          }
        }
      }
    };
    return option;
  }
  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 2,
        span: 22,
      },
    };
    return (
      <div className='login'>
        {/* <ReactEcharts
          option={this.getOption()}
          style={{ height: '700px', width: '100%' }}
        /> */}
        <div className='login-header'>
          <h1>React Admin Demo</h1>
          <div className='tip'>
            <div>Username: admin</div>
            <div>Password: admin</div>
          </div>
        </div>

        <Circle />

        <div className='login-box'>
          <div className='login-title'>Sign in</div>
          <div className='login-content'>
            <Form
              {...layout}
              name="basic"
              initialValues={{
                remember: true,
              }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input placeholder='please enter username' />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input 4-12 digits password!' },
                  { min: 4, },
                  { max: 12, },
                ]}
              >
                <Input.Password placeholder='please enter password' />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" block>
                  Submit
             </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

      </div >

    );
  }

}

export default Login;
