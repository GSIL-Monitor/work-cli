var ua = navigator.userAgent
var platform = navigator.platform
var osinfo = {}
var browserinfo = {}
var webkit = ua.match(/Web[kK]it[/]{0,1}([\d.]+)/)
var android = ua.match(/(Android);?[\s/]+([\d.]+)?/)
var osx = !!ua.match(/\(Macintosh; Intel /)
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/)
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
var webos = ua.match(/(webOS|hpwOS)[\s/]([\d.]+)/)
var win = /Win\d{2}|Windows/.test(platform)
var wp = ua.match(/Windows Phone ([\d.]+)/)
var touchpad = webos && ua.match(/TouchPad/)
var kindle = ua.match(/Kindle\/([\d.]+)/)
var silk = ua.match(/Silk\/([\d._]+)/)
var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)
var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/)
var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/)
var playbook = ua.match(/PlayBook/)
var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/)
var firefox = ua.match(/Firefox\/([\d.]+)/)
var firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/)
var ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^?]+).*rv:([0-9.].)/)
var webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/)
var macOS = ua.match(/OS (9|1[0-9])_\d[_\d]* like Mac OS X/i)
var safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)
var toutiao = ua.match(/newsarticle/i)
var automobile = ua.match(/automobile/i)

// Todo: clean this up with a better OS/browser seperation:
// - discern (more) between multiple browsers on android
// - decide if kindle fire in silk mode is android or not
// - Firefox on Android doesn't specify the Android version
// - possibly devide in os, device and browser hashes

browserinfo.webkit = !!webkit
if (browserinfo.webkit) { browserinfo.version = webkit[1] }
if (automobile) { osinfo.automobile = true }
if (android) { osinfo.android = true; osinfo.version = android[2] }
if (iphone && !ipod) { osinfo.ios = osinfo.iphone = true; osinfo.version = iphone[2].replace(/_/g, '.') }
if (ipad) { osinfo.ios = osinfo.ipad = true; osinfo.version = ipad[2].replace(/_/g, '.') }
if (ipod) { osinfo.ios = osinfo.ipod = true; osinfo.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null }
if (wp) { osinfo.wp = true; osinfo.version = wp[1] }
if (webos) { osinfo.webos = true; osinfo.version = webos[2] }
if (touchpad) { osinfo.touchpad = true }
if (blackberry) { osinfo.blackberry = true; osinfo.version = blackberry[2] }
if (bb10) { osinfo.bb10 = true; osinfo.version = bb10[2] }
if (rimtabletos) { osinfo.rimtabletos = true; osinfo.version = rimtabletos[2] }
if (playbook) { browserinfo.playbook = true }
if (kindle) { osinfo.kindle = true; osinfo.version = kindle[1] }
if (silk) { browserinfo.silk = true; browserinfo.version = silk[1] }
if (!silk && osinfo.android && ua.match(/Kindle Fire/)) { browserinfo.silk = true }
if (chrome) { browserinfo.chrome = true; browserinfo.version = chrome[1] }
if (firefox) { browserinfo.firefox = true; browserinfo.version = firefox[1] }
if (firefoxos) { osinfo.firefoxos = true; osinfo.version = firefoxos[1] }
if (ie) { browserinfo.ie = true; browserinfo.version = ie[1] }
if (macOS) { osinfo.macOS = true }
if (toutiao) { osinfo.toutiao = true }
if (safari && (osx || osinfo.ios || win)) {
  browserinfo.safari = true
  if (!osinfo.ios) { browserinfo.version = safari[1] }
}
if (webview) { browserinfo.webview = true }
osinfo.version = parseFloat(osinfo.version)

browserinfo.ucbrowser = !!ua.match(/ucbrowser/ig)
browserinfo.toutiao = document.referrer === 'http://nativeapp.toutiao.com' ||
    /(News|NewsSocial|Explore|NewsArticle|News_?Article)( |\/)(\d.\d.\d)/i.test(ua)
browserinfo.toutiaoSDK = /(ArticleStreamSdk)( |\/)(\d+)/i.test(ua)
browserinfo.qqbrowser = !!ua.match(/qqbrowser/ig)
browserinfo.weixin = !!ua.toLowerCase().match(/micromessenger/i)
browserinfo.weibo = !!ua.toLowerCase().match(/weibo/i)
browserinfo.liteh5 = /liteh5/i.test(ua)
browserinfo.ttvideo = /ttvideo/i.test(ua)

osinfo.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
(firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
osinfo.phone = !!(!osinfo.tablet && !osinfo.ipod && (android || iphone || webos || blackberry || bb10 ||
(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
(firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))

export const os = osinfo
export const browser = browserinfo
export default {
  os: os,
  browser: browser
}
