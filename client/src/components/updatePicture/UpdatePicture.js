import React from 'react'
import { Upload, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utlis/constants'
import { reqDeleteImg } from '../../api/api';




export default class UpdatePicture extends React.Component {
  constructor(props) {
    super(props);
    //父组件传入的值,用来显示edit用
    const { imgs } = this.props;
    let fileList = []
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((item, key) => ({
        uid: key,
        name: item,
        status: 'done',
        url: BASE_IMG_URL + imgs[key]
      }))
    }
    console.log(imgs);

    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      imgList: [],//上传后,服务器返回res里面的文件名数组传给父组件做提交
      fileList
    };
    console.log(this.state.fileList);
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });

  };
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  //上传中、完成、失败都会调用这个函数。
  handleChange = async ({ file, fileList }) => {

    //设计对非pic图片上传的处理 不是pic的图片没有status=='done'
    if (file.status === 'done') {
      console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length - 1])

      // 一旦上传成功, 将当前上传的file的信息修正(name, url)
      if (file.status === 'done') {
        const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
        if (result.status === 0) {
          message.success('上传图片成功!')
          const { name, url } = result.data
          file = fileList[fileList.length - 1]
          file.name = name
          file.url = url
        } else {
          message.error('上传图片失败')
        }
      }
    } else if (file.status === 'removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }
    // 在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  }

  handleCancel = () => this.setState({ previewVisible: false });
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    //console.log(this.state.fileList);
    return (
      <>
        <Upload
          action="manage/img/upload" //上传的地址
          name='image'//发到后台的文件参数名
          listType="picture-card"
          fileList={fileList}
          accept='image/*'  /*只接收图片格式*/
          onPreview={this.handlePreview}
          onChange={this.handleChange} //图片上传状态改变时的回调函数：uploading、done、error
          beforeUpload={this.beforeUpload} //上传图片时的校验：格式、大小
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}