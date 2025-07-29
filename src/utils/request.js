import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8000/api', // 后端API基础URL
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token，添加到请求头
    const token = store.state.token
    if (token) {
      config.headers['Authorization'] = `Token ${token}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    console.log('请求错误: ' + error)
    
    // 处理错误信息
    let errorMsg = '请求错误'
    if (error.response) {
      const data = error.response.data
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        
        errorMsg = '登录已过期，请重新登录'
      } else if (data.detail) {
        errorMsg = data.detail
      } else if (data.non_field_errors && data.non_field_errors.length > 0) {
        errorMsg = data.non_field_errors[0]
      } else {
        // 处理表单验证错误
        const firstKey = Object.keys(data)[0]
        if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length > 0) {
          errorMsg = `${firstKey}: ${data[firstKey][0]}`
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          // 遍历所有错误并显示第一个
          for (const key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              errorMsg = `${key}: ${data[key][0]}`
              break
            }
          }
        }
      }
    }
    
    Message({
      message: errorMsg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service 