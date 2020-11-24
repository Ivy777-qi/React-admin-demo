// 用来指定商品详情的富文本编辑库
//https://jpuri.github.io/react-draft-wysiwyg/#/demo
//GitHub地址 ： https://github.com/jpuri/react-draft-wysiwyg
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import PropTypes from "prop-types"

class Richtextedit extends Component {
  static propTypes = {
    detail: PropTypes.string
  }
  state = {
    // 创建一个没有内容的编辑对象
    editorState: EditorState.createEmpty()
  }

  constructor(props) {
    super(props);
    const html = this.props.detail;
    console.log(html);
    if (html) {
      // 如果有值, 根据html格式字符串创建一个对应的编辑对象
      //当我们从后台取出html格式的文本，赋值到富文本时，我们还是需要转换一下
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState
        };
      } else {
        this.state = {
          editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
        }
      }
    }
  }

  // 输入过程中实时的回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  getDetail = () => {
    // 返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  // 富文本中的图片上传
  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          resolve({ data: { link: url } })
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }
  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        editorStyle={{ border: "1px solid #000", minHeight: "200px", padding: "0 10px" }}
        //绑定监听，在内容change的时候调用
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          // image: { uploadCallback: this.uploadImageCallBack, alt: { present: false, mandatory: true, previewImage: true } },
          image: {
            urlEnabled: true,
            uploadEnabled: true,
            alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
            uploadCallback: this.uploadImageCallBack,
            previewImage: true,
            inputAccept: 'image/*',
            alt: { present: false, mandatory: false, previewImage: true }
          },
        }}
      />
    )
  }
}

export default Richtextedit;