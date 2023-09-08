import axios from 'axios'
let sha256 = require("js-sha256").sha256

// 30s超时
let baseUrl = '/cfd-api/'
axios.defaults.timeout = 10000
axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.baseURL = baseUrl

let deviceId = localStorage.getItem('deviceId') || ''
let deviceName = ''
try {
  deviceName = navigator.userAgentData.brands[2].brand
} catch (e) {
  deviceName = navigator.userAgent
}
let platform = navigator.userAgentData.platform

if (!deviceId) {
  const fpPromise = import('@fingerprintjs/fingerprintjs').then(FingerprintJS => FingerprintJS.load())
  fpPromise.then(fp => fp.get()).then(result => {
    deviceId = result.visitorId
    localStorage.setItem('deviceId', deviceId)
  })
}

// 请求拦截器
axios.interceptors.request.use(function (config) {
  if (config.data) {
    config.data._ts = undefined
  }
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo && userInfo.token) {
    config.headers['Authorization'] = userInfo.token
  }
  config.headers['deviceId'] = deviceId
  config.headers['deviceName'] = deviceName
  config.headers['platform'] = platform

  let ts = new Date().getTime()
  config.headers['timestamp'] = ts
  config.headers['sign'] = sha256(ts + deviceId)

  return config
}, function (error) {
  return Promise.reject({
    message: error + ''
  })
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.success) {
    return response.data.data
  }
  return Promise.reject({
    msg: response.data.msg,
    code: response.data.code
  })
}, function (error) {
  return Promise.reject({
    code: error.response.status,
    msg: error.response.statusText + '(' + error.response.status + ')'
  })
})

export default axios
