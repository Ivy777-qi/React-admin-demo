import React, { Component } from 'react'
import { reqAddCategory, reqGetCategory, reqUpdateCategory } from '../../api/api'
import AddCategoryForm from '../../components/addCategoryForm/AddCategoryForm';
import UpdateCategoryForm from '../../components/updateCategoryForm/UpdateCategoryForm'
import LinkButton from '../../components/linkbutton/LinkButton'
import { Card, Button, Table, Modal, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons';


export default class Category extends Component {
  state = {

    categoryies: [], // 一级分类列表
    parentId: '0',
    subCategories: [],//二级分类
    loading: false,
    parentName: '', // 当前需要显示的分类列表的父分类名称
    showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    noChildrenId: [],//找出没有二级分类的一级的id
  }

  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getList();
  }

  //存储CascaderCom中noLEAF的id
  componentWillUnmount() {

  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Category',
        dataIndex: 'name',
        key: 'name',
        width: '70%',//设置列宽
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (rowData) => (
          <Space size="middle">
            <LinkButton onClick={() => this.showUpdateCategory(2, rowData)}>Edit</LinkButton>
            {
              this.state.parentId === '0' ? <LinkButton onClick={() => this.getSubcategory(rowData)}>Subcategory</LinkButton> : ''
            }

          </Space>
        ),
      },
    ];

  }
  getSubcategory = (rowData) => {

    console.log(rowData);
    this.setState({
      parentName: rowData.name,
      parentId: rowData._id
    })
    this.getList(rowData._id);
  }
  // 更新
  showUpdateCategory = (value, rowData) => {
    this.setState({
      showStatus: value
    })
    this.singleItem = rowData;
    console.log(rowData);

    // if (this.form != undefined) {//第一个进入为undefined,设置改变后input的值
    //   console.log(this.form);
    //   console.log(rowData.name);
    //   this.form.current.setFieldsValue({ categoryName: rowData.name });
    // }

  }

  updateCategory = () => {
    this.form.current.validateFields().then(async (values) => {
      this.setState({
        showStatus: 0,
      });
      console.log(values);
      const categoryId = this.singleItem._id;
      const { categoryName } = values;
      console.log(categoryId, categoryName);
      this.form.current.resetFields();

      const result = await reqUpdateCategory({ categoryId, categoryName });

      if (result.status === 0) {
        // 3. 重新显示列表
        this.getList(this.singleItem.parentId);
      }


    }).catch(err => {
      console.log(err);
    })

  }

  // 取消
  handleCancel = () => {
    this.setState({
      showStatus: 0
    })
  }

  getList = async (parentId) => {
    console.log("woowowoowowowowoowowowowoowowowowoowowowowowo");
    console.log(this.state.noChildrenId);
    const { noChildrenId } = this.state;
    let options = [];

    parentId = parentId || this.state.parentId; //去掉undefined
    console.log(parentId);
    const result = await reqGetCategory(parentId);
    if (result.status === 0) {
      if (parentId === '0') {
        this.setState({
          categories: result.data,
          parentId: '0'
        })
      } else {
        this.setState({
          subCategories: result.data
        })
      }
      console.log(result.data);
      if (result.data.length === 0) {
        options.push(parentId);
        this.setState({
          noChildrenId: [...noChildrenId, options]
        })
      }
    }
    let arr = [];
    arr = noChildrenId.filter(function (ele, index, self) {
      return self.indexOf(ele) === index;
    });
    localStorage.setItem('noLEAF', JSON.stringify(arr));

  }
  //添加种类
  showAddCategory = (value) => {
    this.setState({
      showStatus: 1,
    });
  }
  addCategory = () => {
    this.form.current.validateFields().then(async (values) => {
      this.setState({
        showStatus: 0,
      });
      const { parentId, categoryName } = values;

      console.log(parentId);
      const result = await reqAddCategory(categoryName, parentId);
      // this.form.current.resetFields();

      this.setState({
        parentId
      });
      this.getList(parentId);
    }).catch(err => {
      console.log(err);
    })

  }

  handleCancel = e => {
    console.log(12121212);
    this.form.current.resetFields();
    this.setState({
      showStatus: 0,
    });

  }
  render() {
    const { categories, parentId, subCategories, loading, parentName, showStatus } = this.state;
    const title = parentId === '0' ? 'The first level category' : (<span>
      <LinkButton onClick={() => this.getList('0')}>The first level category</LinkButton>
      <ArrowRightOutlined style={{ marginRight: 5 }} />
      <span>{parentName}</span>
    </span>)
    const singleItem = this.singleItem || {};
    return (
      <div className='category'>
        <Card title={title} bordered={false} extra={<Button type="primary" onClick={() => this.showAddCategory(1)}>+ More</Button>} style={{ marginRight: -15 }}>
          <Table
            rowKey='_id'
            columns={this.columns}
            loading={loading}
            dataSource={parentId === '0' ? categories : subCategories}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
            bordered

          />
        </Card>
        <Modal
          title="Add Category"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          {/* 父组件调用子组件 */}
          <AddCategoryForm
            categories={categories}
            parentId={parentId}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
        {/* 更新 */}
        <Modal
          title="Update Category"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          {/* 父组件调用子组件 */}
          <UpdateCategoryForm
            singleItem={singleItem.name}
            setForm={(form) => { this.form = form }}
          />
        </Modal>
      </div >
    )
  }
}