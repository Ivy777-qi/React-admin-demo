import React, { Component } from 'react'
import { reqGetProductList, reqSearchProducts, reqUpdateStatus } from '../../api/api'
import LinkButton from '../../components/linkbutton/LinkButton'
import { Card, Button, Table, Space, Select, Form, Input, Pagination, message } from 'antd'
import { PAGE_SIZE } from '../../utlis/constants';


const { Option } = Select;

export default class Products extends Component {
  state = {

    products: [],
    parentId: '0',
    subCategories: [],//二级分类
    loading: false,
    parentName: '', // 当前需要显示的分类列表的父分类名称
    showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    total: 0,
    pageNum: 1,
    pageSize: PAGE_SIZE,
    searchType: 'productName',//设置默认字段搜索
    searchName: ''
  }

  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getProductList(1);//设置开始时pagenum为1
  }

  getProductList = async (pageNum) => {
    const { pageSize } = this.state;
    this.setState({
      loading: true
    })
    console.log(pageNum);
    const result = await reqGetProductList(pageNum, pageSize);
    const { total, list } = result.data;
    if (result.status === 0) {
      this.setState({
        total,
        products: list,
        loading: false
      })
    }
    console.log(this.state.products);
    console.log(result);

  }
  changeStatus = async (id, status) => {
    const result = await reqUpdateStatus(id, status)
    console.log(result);
    if (result.status === 0) {
      message.success('  Status update success!')
      this.getProductList(this.state.pageNum)
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Product',
        dataIndex: 'name',
        key: 'name',
        width: '20%',//设置列宽
      },
      {
        title: 'Description',
        dataIndex: 'desc',
        key: 'description',
        width: '40%',//设置列宽
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width: '12%',//设置列宽
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '15%',//设置列宽
        render: (status, product) => {
          const newStatus = status === 1 ? 2 : 1
          return (

            <span style={{ textAlign: 'center' }}>
              <Button type="primary" style={{ marginLeft: '35px' }} onClick={() => this.changeStatus(product._id, newStatus)}>
                {status === 1 ? 'Sold out' : 'For sale'}
              </Button>
              <div> {status === 1 ? 'For sale' : 'Sold out'}</div>
            </span>
          )
        }
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (product) => (
          <Space size="middle">
            <LinkButton onClick={() => this.props.history.push('/detail', { product })}>Detail</LinkButton>
            <LinkButton onClick={() => this.props.history.push('/add', product)}>Edit</LinkButton>
          </Space>
        ),
      },
    ];

  }

  //显示添加商品页面
  showAddGoods = () => {
    this.props.history.push('/add');
  }
  //分页器改变  onChangePage = (pageNum, pageSize) => {}
  onChangePage = (pageNum) => {
    console.log(pageNum);
    this.setState({
      pageNum
    })
    this.getProductList(pageNum);
  }
  searchList = async () => {  //{ pageNum, pageSize, searchName, searchType }
    const { pageNum, pageSize, searchType, searchName } = this.state;
    this.setState({
      loading: true
    })
    console.log(searchType, searchName);
    const result = await reqSearchProducts({ pageNum, pageSize, searchName, searchType });
    if (result.status === 0) {
      const { total, list } = result.data
      this.setState({
        total,
        products: list,
        loading: false
      })
    }
    console.log(this.state.total);

  }

  render() {
    const { products, loading, pageNum, total, searchType } = this.state;
    const title = (
      <Form
        name="normal_login"
        className="login-form"
        layout='inline'
      >
        <Form.Item name={searchType} style={{ width: '180px' }} initialValue='productName' >
          {/* defaultValue="name"不能设置在select上,设 initialValue在item上*/}
          <Select onChange={value => this.setState({ searchType: value })} >
            <Option value='productName'>Search by name</Option>
            <Option value='productDesc'>Search by description</Option>
          </Select>
        </Form.Item>
        {/* 添加name自动添加value属性 */}
        <Form.Item name='searchName' >
          <Input placeholder="Keyword" onChange={(e) => this.setState({ searchName: e.target.value })} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={this.searchList} >
            Search
        </Button>
        </Form.Item>
      </Form>
    )
    //reactNode写成对象形式的 const cardExtra = ()
    const cardExtra = (
      <Button type="primary" onClick={this.showAddGoods} style={{ marginRight: -15 }}>
        + More
      </Button>
    )

    return (
      <div className='goods'>
        <Card title={title} bordered={false} extra={cardExtra}>

          <Table
            rowKey='_id'
            columns={this.columns}
            loading={loading}
            dataSource={products}
            pagination={false}
            bordered

          />
          <Pagination
            current={pageNum}
            total={total}
            defaultPageSize={PAGE_SIZE}
            showQuickJumper
            showTotal={total => `Total ${total} items`}
            style={{ float: 'right', marginTop: 10 }}
            onChange={this.onChangePage}
          />
        </Card>
        {/* 更新 */}
        {/* <Modal
          title="Update Category"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        > */}
        {/* 父组件调用子组件 */}
        {/* <UpdateCategoryForm
            singleItem={singleItem.name}
            setForm={(form) => { this.form = form }}
          />
        </Modal> */}
      </div >
    )
  }

}