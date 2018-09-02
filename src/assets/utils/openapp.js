const appendFrame = (id, src) => {
  var element = document.createElement('iframe');
  element.id=id;
  element.src=src;
  element.style.display="none";
  document.body.appendChild(element);
}

export function openApp (schemeurl, dLink, yybLink) {
  var userAgent = navigator.userAgent.toLowerCase()
  var isAndroid = /android/i.test(userAgent)
  var isIos = /iphone|ipad|ipod/i.test(userAgent)
  var isWeixin = /micromessenger/i.test(userAgent)
  var loadTimer = null
  var waitTime = 1000
  var scheme
  dLink = dLink || '//d.toutiao.com/Bo81/'
  scheme = schemeurl || 'snssdk36://'
  yybLink = yybLink || '//a.app.qq.com/o/simple.jsp?pkgname=com.ss.android.auto&ckey=CK1376586446502'
  var currentUrl = window.location.href
  if (isAndroid) {
    if (isWeixin) {
      // Android 微信不支持schema唤醒，必须提前加入腾讯的白名单， 跳转到应用宝 地址
      window.location.href = yybLink
    } else {
      // 打开外链
      document.body.removeChild(document.querySelector("#app_iframe"));
      appendFrame('app_iframe', `'${scheme}'`);
    }
  }
  if (isIos) {
    if ((userAgent.match(/OS (9|1[0-9])_\d[_\d]* like Mac OS X/i))) {
      location.href = scheme
    } else {
      document.body.removeChild(document.querySelector("#app_iframe"));
      appendFrame('app_iframe', `'${scheme}'`);
      // location.href = scheme
    }
  }
  var start = Date.now()
  loadTimer = setTimeout(function () {
    if (document.hidden || document.webkitHidden) {
      return
    }
    // 如果app启动，浏览器最小化进入后台，则计时器存在推迟或者变慢的问题
    // 那么代码执行到此处时，时间间隔必然大于设置的定时时间
    if (Date.now() - start > waitTime + 200) {
      // come back from app
      window.location.href = currentUrl
      // 如果浏览器未因为app启动进入后台，则定时器会准时执行，故应该跳转到下载页
    } else {
      window.location.href = dLink
    }
  }, waitTime)

  // 当本地app被唤起，则页面会隐藏掉，就会触发pagehide与visibilitychange事件
  // 在部分浏览器中可行，网上提供方案，作hack处理
  var visibilitychange = function () {
    var tag = document.hidden || document.webkitHidden
    tag && clearTimeout(loadTimer)
  }
  document.addEventListener('visibilitychange', visibilitychange, false)
  document.addEventListener(
    'webkitvisibilitychange',
    visibilitychange,
    false
  )
  // pagehide 必须绑定到window
  window.addEventListener(
    'pagehide',
    function () {
      clearTimeout(loadTimer)
    },
    false
  )
}

export default {
  openApp: openApp
}
