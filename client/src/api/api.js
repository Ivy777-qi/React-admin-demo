import { message } from 'antd'
import ajax from '../utlis/request'

const BASE = ''
// 登陆
/*
export function reqLogin(username, password) {
  return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST');
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST');
//获得分类类别
export const reqGetCategory = (parentId) => ajax(BASE + '/manage/category/list', { parentId });
//根据分类 ID 获取分类
export const reqCategory = (categoryId) => ajax(BASE + 'manage/category/info', { categoryId });
//更新类别
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST');

//获取商品分页列表
export const reqGetProductList = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize });

// 添加产品
export const reqAddGoods = (product) => ajax(BASE + '/manage/product/add', product, 'POST');
// 修改商品
export const reqUpdateGoods = (product) => ajax(BASE + '/manage/product/update', product, 'POST');

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')
// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})


// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')
// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', { userId }, 'POST')

//获得weather和图标
//https://rapidapi.com/community/api/open-weather-map/endpoints
export const reqweather = (city) => {
  return new Promise((resolve, reject) => {
    const axios = require("axios");
    axios({
      "method": "GET",
      "url": "https://community-open-weather-map.p.rapidapi.com/weather",
      "headers": {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
        "x-rapidapi-key": "8d050a1c2cmshca8ecbc3e9644d1p108fffjsn0cebef399b2f"
      }, "params": {
        "q": city
      }
    }).then(response => {
      console.log(response);
      if (response.status === 200) {
        const { main, icon } = response.data.weather[0]
        resolve({ main, icon });
      } else {
        reject(response.data.message);
      }
    })
      .catch(error => {
        // reject(error)
        message.error('请求出错了: ' + error.message)
      }).catch(error => {
        // reject(error)
        message.error('请求出错了: ' + error.message)
      })
  })
}