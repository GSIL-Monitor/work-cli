// 代理配置文件

var proxys = {
  '/motor/sf/game/': {
      target: 'http://auto.365yg.com',
      secure: false,
      changeOrigin: true
  },
  '/h/1/cli/share/*': {
      target: 'http://10.11.40.72:8335',
      secure: false,
      changeOrigin: true
  }
}

module.exports = proxys
