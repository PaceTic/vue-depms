/*
 * @Author: cdroid
 * @Date: 2017-05-25 10:50:35
 * @Last Modified by: cdroid
 * @Last Modified time: 2017-08-17 10:00:17
 * @Description:  axios 封装实现类
 */
import Tools from './tools'
// import store from './../../vuex/store'
import NProgress from 'nprogress'
import { Notice } from 'iview'

function setApiHeader (config) {
  // if (store.getters.isLogin) {
  // var storage = store.getters.getUserStorage
  var at = sessionStorage.getItem('token')
  var name = sessionStorage.getItem('user') || ''
  var uuid = Tools.uuid()
  var time = new Date().getTime()
  var appSecret = at + ',' + name + ',' + uuid + ',' + time
  var key = Tools.sha1(appSecret)
  config.headers['Api-Version'] = 'v1.0'
  config.headers['Api-Loginname'] = name
  config.headers['Api-Nonce'] = uuid
  config.headers['Api-Time'] = time
  config.headers['Api-Key'] = key
   // }
  return config
}

export default {
  requestInterceptor (axios) {
    axios.interceptors.request.use(config => {
      NProgress.start()
      return setApiHeader(config)
    }, error => {
      return Promise.reject(error)
    })
  },
  responseInterceptor (axios) {
    axios.interceptors.response.use(response => {
      if (NProgress) {
        NProgress.done()
      }
      return response
    }, error => {
      if (NProgress) {
        NProgress.done()
      }
      let title = '错误'
      if (error.response.status === 403) {
        title = '获取权限失败，请重新登陆'
      } else if (error.response.status === 504) {
        title = '连接服务器失败'
      } else if (error.response.status === 500) {
        title = '错误'
      }
      Notice.error({
        title: title,
        desc: '错误' + error.response.status
      })
      // util.responseError(error.response.status)
      return Promise.reject(error)
    })
  }
}
