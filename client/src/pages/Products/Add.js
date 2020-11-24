import React, { Component } from 'react'
import LinkButton from '../../components/linkbutton/LinkButton'
import { Card, Button, Form, Input, InputNumber, Cascader } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import Richtextedit from "../../components/richtextedit/Richtextedit";
import UpdatePicture from '../../components/updatePicture/UpdatePicture';
import { reqAddGoods, reqCategory, reqUpdateGoods, reqGetCategory } from '../../api/api';
import { getIsLeaf } from '../../utlis/cookies';


export default class Add extends Component {
  constructor(props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.editor = React.createRef();
    this.picture = React.createRef();

    this.state = {
      product: {},
      pCategoryName: '',
      categoryName: '',
      options: [],//Cascader 
      selectedOptions: [],//Cascader 
      isLoading: false
    }

  }

  componentWillMount() {
    // 取出携带的state
    const product = this.props.location.state  // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    if (product) {
      this.isUpdate = true;
    }
    // 保存商品(如果没有, 保存是{})
    this.product = product || {}
    console.log(product);
    if (this.isUpdate) {
      this.getCascader(this.product);
    }

  }
  componentDidMount() {

    this.initData();
  }

  getCascader = async (product) => {
    console.log(product);
    const { categoryId, pCategoryId } = product;
    let pCategory = '';
    let category = '';
    //通过Id来获取种类名称
    if (pCategoryId === '0') {
      const result = await reqCategory(categoryId);
      console.log(result);
      if (result.status === 0) {

        pCategory = result.data.name
      }
      // categoryNames.push(pCategoryName)
    } else {
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])//同时进行请求
      console.log(results);
      if (results[0].status === 0 && results[1].status === 0) {

        pCategory = results[0].data.name;
        category = results[1].data.name;
      }
    }
    this.setState({
      pCategoryName: pCategory,
      categoryName: category,
    })

  }

  //提交验证
  onFinish = async (values) => {
    let category;
    let pCategoryId = '0';
    let categoryId = '';
    let product = {};
    const state = this.props.location.state;
    //收集数据
    const { name, desc } = values
    category = values.category;
    console.log(category);
    console.log(values);
    const price = values.price.toString();
    console.log(price);
    const detail = this.editor.current.getDetail();
    const imgs = this.picture.current.getImgs();
    console.log(imgs);
    if (state) {
      if (this.state.selectedOptions.length === 0) {
        pCategoryId = state.pCategoryId;
        categoryId = state.categoryId;
      } else {
        if (category.length === 2) {
          pCategoryId = category[0];
          categoryId = category[1];
        } else {
          categoryId = category;
        }
      }

      // imgs = this.imgs;
      const { _id } = this.props.location.state;
      product = { _id, name, desc, price, imgs, detail, pCategoryId, categoryId }
      console.log(55545646456464);
    } else {//add
      const imgs = this.picture.current.getImgs();
      const cascader = this.state.selectedOptions;
      console.log(cascader);
      if (cascader.length === 2) {
        pCategoryId = cascader[0].value
        categoryId = cascader[1].value
        this.setState({
          pCategoryName: cascader[0].lable,
          categoryName: cascader[1].lable
        })
      } else {
        categoryId = cascader[0].value;
        this.setState({
          categoryName: cascader[0].lable
        })
      }

      product = { name, desc, price, imgs, detail, pCategoryId, categoryId }//注意api接口的大小写
      console.log(32324324324);
    }
    //发送请求
    console.log(product);
    const result = this.props.location.state ? await reqUpdateGoods(product) : await reqAddGoods(product);

    if (result.status === 0) {
      console.log(result);
      this.props.history.goBack()
    }

  }
  //校验条件自定义 提交的时候验证
  checkCascaderCom = () => {
    //验证选中的数组里面有没有值
    console.log("checkCascaderCom");
    if (this.state.selectedOptions.length > 0 || this.props.location.state) {
      return Promise.resolve();
    }

    return Promise.reject('please enter');
  };
  // Cascader获取一级列表
  initData = async () => {
    let options = [];
    const result = await reqGetCategory('0');

    if (result.status === 0) {
      result.data && result.data.forEach(item => {
        //  const flag = this.getIsLeaf(item._id)
        const list = {
          value: item._id,
          label: item.name,
          isLeaf: false
        };
        options.push(list);
      });
      //从localStorage读取数据,来判断isLeaf
      let noLeafArr = JSON.parse(localStorage.getItem('noLEAF'));
      if (noLeafArr) {
        noLeafArr = noLeafArr.join(',').split(',');
        options && options.map(item =>
          item.isLeaf = noLeafArr.indexOf(item.value) === -1 ? false : true //-1是不存在.0,1,2,3...存在
        )
      }
      this.setState({
        options
      })
      console.log(this.state.options);
    }
  }
  // 获取当前父元素下的二级列表Cascader
  getIsLeaf = async (parentId) => {
    const result = await reqGetCategory(parentId);
    if (result.status === 0)
      return result.data === [] ? true : false

  }
  //Cascader
  onChange = (value, selectedOptions) => {
    this.setState({
      selectedOptions,
    })
    console.log("value" + value);
    console.log(selectedOptions);
  };
  //Cascader
  loadData = async selectedOptions => {
    console.log(selectedOptions);

    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = [];
    const result = await reqGetCategory(targetOption.value);
    if (result.status === 0) {
      if (result.status === 0) {
        targetOption.loading = false;
        result.data && result.data.forEach(item => {
          const list = {
            value: item._id,
            label: item.name,
          };
          console.log(list);
          targetOption.children.push(list);
        });

        this.setState({
          options: [...this.state.options]
        })
      }
    }


  };
  //Cascader render的改写
  displayRender = (label) => {
    const { pCategoryName, categoryName } = this.state;
    if (this.props.location.state) {
      if (label.length === 0) {
        return pCategoryName + '/' + categoryName;
      } else {
        return label.join('/');
      }
    } else {
      if (label.length === 0) {
        return <span style={{ color: 'rgba(176, 176, 176, 0.8)' }}>Please select </span>
      } else {
        return label.join('/');
      }
    }
  }
  setPlaceholder = () => {
    if (this.props.location.state) {
      return ''
    } else {
      return 'Please select';
    }
  }
  render() {
    const { isUpdate, product } = this;
    const { imgs, detail, name, desc, price } = product
    const { pCategoryName, categoryName } = this.state;

    const layout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 10,
      },
    };
    const validateMessages = {
      required: '${label} is required!',
      types: {
        number: '${label} is not valid!',
      },
    };
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}><ArrowLeftOutlined /></LinkButton>
        <span>{isUpdate ? 'Update' : 'Add'}</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form {...layout} onFinish={this.onFinish} validateMessages={validateMessages}>
          <Form.Item
            initialValue={name}
            name='name'
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}

          >
            <Input placeholder="Please enter the product name" />
          </Form.Item>
          <Form.Item
            initialValue={desc}
            name='desc'
            label='Description'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea placeholder="Please enter the description" />
          </Form.Item>
          <Form.Item
            initialValue={price}
            name='price'
            label="Price"
            rules={[
              {
                type: 'number',
                required: true,
              },
            ]}
          >
            <InputNumber min={0} style={{ width: 150 }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')} />
          </Form.Item>

          <Form.Item name='category' label="Category" required
            rules={[{ validator: this.checkCascaderCom }]}
            initialValue={pCategoryName, categoryName}

          >
            <Cascader
              options={this.state.options}
              loadData={this.loadData}
              onChange={this.onChange}
              displayRender={this.displayRender}
              changeOnSelect
              placeholder={this.setPlaceholder} />
          </Form.Item>

          <Form.Item name='imgs' label="Picture">
            <UpdatePicture ref={this.picture} imgs={imgs} />
          </Form.Item>
          <Form.Item name='detail' label="Detail" wrapperCol={{ span: 20 }}>
            <Richtextedit ref={this.editor} detail={detail}></Richtextedit>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
            <Button type="primary" htmlType="submit" onClick={this.submit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card >
    )
  }

}
