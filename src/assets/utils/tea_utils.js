import collectorEvent from './tea.js'

var collectEvent = window.collectEvent || collectorEvent

var init = function ({ appId, serviceName, userWebId, zt }) {
  // 可选择开启debug模式。debug模式上报地址为测试服务器（只支持http。测试https需关闭debug模式，上报到线上地址）。
  collectEvent.setDebug(false)
  // 设置外网可上报
  collectEvent.setIntranetMode(false)

  collectEvent.setRequiredKeys({
    user: ['user_unique_id', 'user_id'],
    header: ['app_id']
  })

  // 设置appId。必须配置。
  collectEvent.setAppId(appId)

  // 设置header自定义字段
  collectEvent.setHeaderHeaders({
    user_agent: navigator.userAgent,
    service_name: serviceName,
    zt: zt || 'default'
  })

  // 设用户相关信息
  collectEvent.setUser({
    user_unique_id: userWebId,
    user_id: userWebId,
    user_type: 13
  })
}

function sessionStorageEnabled () {
  var mod = 'test'
  try {
    sessionStorage.setItem(mod, mod)
    sessionStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}

var autoSessionStorage = (function () {
  function setItem (key, value) {
    if (!sessionStorageEnabled()) { return null }
    try {
      sessionStorage.setItem(key, value)
    } catch (e) {
      // silent
    }
  }

  function getItem (key) {
    if (!sessionStorageEnabled()) { return null }
    return sessionStorage.getItem(key)
  }

  return {
    setItem,
    getItem
  }
}())

function localStorageEnabled () {
  var mod = 'test'
  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}

var autoLocalStorage = (function () {
  function setItem (key, value) {
    if (!localStorageEnabled()) { return null }
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      // silent
    }
  }

  function getItem (key) {
    if (!localStorageEnabled()) { return null }
    return localStorage.getItem(key)
  }

  return {
    setItem,
    getItem
  }
}())

function cloneDeep (object) {
  return JSON.parse(JSON.stringify(object))
}

function queryParams (paras) {
  var url = location.search
  var paraString = url.substring(1).split('&')
  var paraObj = {}
  for (var i = 0, len = paraString.length; i < len; i++) {
    var j = paraString[i]
    if (j) {
      paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
    }
  }

  if (!paras) { return paraObj }
  var returnValue = paraObj[paras.toLowerCase()]
  return returnValue ? returnValue.trim() : ''
}

var cookie = function (name, value, options) {
  if (typeof value !== 'undefined') {
    options = options || {}
    if (value === null) {
      value = ''
      options.expires = -1
    }
    var expires = ''
    if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
      var date
      if (typeof options.expires === 'number') {
        date = new Date()
        date.setTime(date.getTime() + (options.expires))
      } else {
        date = options.expires
      }
      expires = '; expires=' + date.toUTCString()
    }
    var path = options.path ? '; path=' + options.path : ''
    var domain = options.domain ? '; domain=' + options.domain : ''
    var secure = options.secure ? '; secure' : ''
    document.cookie = [
      name,
      '=',
      encodeURIComponent(value),
      expires,
      path,
      domain,
      secure
    ].join('')
  } else {
    var cookieValue = null
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';')
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim()
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }
}

function generateGuuId () {
  var sUniqueId = queryParams('user_id') || cookie('tt_webid')
  if (sUniqueId) {
    return sUniqueId
  } else {
    sUniqueId = autoLocalStorage.getItem('tea_unique_id')
    if (!sUniqueId) {
      sUniqueId = guuid()
      autoLocalStorage.setItem('tea_unique_id', sUniqueId)
      return sUniqueId
    }
    return sUniqueId
  }
}

function guuid () {
  var uuid = new Date().valueOf() + Math.random().toFixed(6).substring(2)
  return uuid
}

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};

var uniqueId = generateGuuId()

init({
  appId: 1230,
  serviceName: 'car_hero',
  userWebId: uniqueId,
  zt: queryParams('zt') || 'default'
})

var stayParams = {}
var stayTimer = null
// 切换页面时先报stay，再上报进入页面的enter
export var sendTeaEnterEvent = debounce(function (params) {
  if (!params.page_id) return
  // pre_page_id必须, pre_sub_tab不必须
  params['pre_page_id'] = params['pre_page_id'] || ''
  if (autoSessionStorage.getItem('pre_page_id') && !params['pre_page_id']) {
    params['pre_page_id'] = autoSessionStorage.getItem('pre_page_id')
  }
  if (autoSessionStorage.getItem('pre_sub_tab') && !params['pre_sub_tab']) {
    params['pre_sub_tab'] = autoSessionStorage.getItem('pre_sub_tab')
  }
  // 记录当前页信息，其他事件使用
  autoSessionStorage.setItem('page_id', params.page_id || '')
  autoSessionStorage.setItem('sub_tab', params.sub_tab || '')
  if (process.env.NODE_ENV === 'development') {
    console.log('***web_page_enter***', params)
  }
  collectEvent('web_page_enter', params)
  // 记录当前页信息
  stayTimer = new Date()
  stayParams = cloneDeep(params)
}, 500, true)

// 同一个html内部切换用
export var sendTeaStayEvent = debounce(function (params) {
  if (params) {
    stayParams = params
  } else {
    stayParams.stay_time = stayTimer ? (new Date().getTime() - stayTimer.getTime()) : -1
  }
  if (!stayParams.page_id) return
  // 记录当前页信息，下页pre使用
  autoSessionStorage.setItem('pre_page_id', stayParams.page_id || '')
  autoSessionStorage.setItem('pre_sub_tab', stayParams.sub_tab || '')
  if (process.env.NODE_ENV === 'development') {
    console.log('***web_page_stay_time***', stayParams)
  }
  collectEvent('web_page_stay_time', stayParams)
}, 500, true)

export var sendTeaCommEvent = function (event, params) {
  if (process.env.NODE_ENV === 'development') {
    console.log('***' + event + '***', params)
  }
  collectEvent(event, params)
}

/*
** 页面unload时，统计请求会被cancel
** 故离开页面保存stay params, 下一页面上报page stay
*/
var hiddenProperty = 'hidden' in document ? 'hidden'
  : 'webkitHidden' in document ? 'webkitHidden'
    : 'mozHidden' in document ? 'mozHidden'
      : null
var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
var onVisibilityChange = function () {
  if (document[hiddenProperty]) {
    stayParams.stay_time = stayTimer ? (new Date().getTime() - stayTimer.getTime()) : -1
    autoSessionStorage.setItem('pre_page_stay_params', JSON.stringify(stayParams))
  }
}
document.addEventListener(visibilityChangeEvent, onVisibilityChange)

export default {
  sendTeaEnterEvent,
  sendTeaStayEvent,
  sendTeaCommEvent
}
