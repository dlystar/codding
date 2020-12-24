import axios from 'axios'
import store from '@/store'
import Qs from 'qs'
import { setToken, getToken } from './util'
import Vue from 'vue'
import router from '@/router/index'

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Authorization' : getToken(),
        'Content-Type' : 'application/x-www-form-urlencoded'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res

      if(data.result == 0 && data.code && data.code == '10000'){
        if(url === 'log/saveErrorLog'){
          new Vue().$Message.error({
            content: '登陆已过期，正在跳转登陆...',
            duration: 2
          })
        }else{
          //登陆过期
          new Vue().$Message.error({
            content: '登陆已过期，正在跳转登陆...',
            duration: 2,
            onClose (){
              store.dispatch('handleLogOut').then( ()=> router.push('/login'))
            }
          })
        }

      }else if(data.result == 0 && data.code && data.code == '20000'){
        new Vue().$Message.error('您没有当前请求的权限！')
        return { data, status }
      }else{
        return { data, status }
      }
    }, error => {
      console.log(url)
      if(url === 'log/saveErrorLog'){

      }else{
        this.destroy(url)
        let errorInfo = error.response
        if (!errorInfo) {
          const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
          errorInfo = {
            statusText,
            status,
            request: { responseURL: config.url }
          }
        }
        addErrorLog(errorInfo)
        return Promise.reject(error)
      }
    })
  }
  request (options) {
    options.data = Qs.stringify(options.data)
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
