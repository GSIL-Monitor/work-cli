var webpack = require('webpack')
var path = require('path')
var proxy = require('http-proxy-middleware')
var apiMocker = require('webpack-api-mocker')

var webpackDevServer = require('webpack-dev-server')
var WebpackHotMiddleware = require('webpack-hot-middleware')
var config = require('../build/webpack.dev.conf.js')
var { dev } = require('../config/config.js')
var devproxy = require('../config/dev.proxy.js')
var mocker = path.resolve('mock/app.js')
var detect = require('detect-port')
var chalk = require('chalk')
var chokidar = require('chokidar')
var {start, send} = require('./fork')
var {RESTART} = require('./signal')
var clearConsole = require('react-dev-utils/clearConsole')
var getProcessForPort = require('react-dev-utils/getProcessForPort')
var openBrowser = require('react-dev-utils/openBrowser')
var prompt = require('react-dev-utils/inquirer').prompt 
var Compiler = require('./compiler')
var isInteractive = process.stdout.isTTY; // 判断是否文本终端,便于clearConsole
var protocol = dev.protocol
var host = dev.host
// 热重启配置
function setupDevConfig(port) {
  var devServerConfig = {
    disableHostCheck: true,
    host: host,
    port: port,
    https: protocol === 'https',
    compress: true, // 启动gzip压缩
    contentBase: path.join(__dirname, '../dist'),
    clientLogLevel: 'none',
    hot: true, // 开启 Hot module replacement
    quiet: true,
    noInfo: false,
    overlay: {
      errors: true // 在webpack编译出错的时候，在页面上显示弹窗
    },
    headers: {
      'access-control-allow-origin': '*',
    },
    watchOptions: {
      ignored: /node_modules/
    },
    publicPath: dev.publicPath,
    stats: { colors: true }, // 彩色输出
    // historyApiFallback: { // 让我们所有404的请求都返回这个
    //     index: '/home/index.html'
    // },
    setup(app) {
      apiMocker(app, mocker);
    },
    proxy: {

    }
  }

  Object.keys(devproxy).forEach(function(context) {
    var options = devproxy[context];
    devServerConfig.proxy[context] = options
  });
  return devServerConfig;
}

// 监听文件变动
function setupWatch(devServer) {
  const files = [
    path.join(__dirname, '../build/'),
    path.join(__dirname, '../config/')
  ]
  const watcher = chokidar.watch(files, {
    ignored: /node_modules/,
    persistent: true,
  });
  watcher.on('change', (path) => {
    console.log(chalk.green(`File ${path.replace(__dirname, '.')} changed, try to restart server`));
    watcher.close();
    devServer.close();
    send(RESTART)
  });
}

function runDevServer(compiler, devConfig, url) {
  var devServer = new webpackDevServer(compiler, devConfig);
  devServer.use(WebpackHotMiddleware(compiler));
  devServer.listen(devConfig.port, (err) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();
    // if (isInteractive) {
    //   outputMockError();
    // }
    openBrowser(url);
  });
  setupWatch(devServer)
}

function run(port) {
  let url = `${protocol}://${host}:${port}${dev.autoOpen}`
  console.log("[4]")
  let devConfig = setupDevConfig(port)
  console.log("[5]")
  let compiler = Compiler(config, url)
  console.log("[url]", url)
  runDevServer(compiler, devConfig, url)
}

function init() {
  console.log('[init]', dev.browserPort);
  detect(dev.browserPort).then((port) => {
    console.log("[2]")
    const DEFAULT_PORT = dev.browserPort;
    if (port == DEFAULT_PORT) {
      console.log("[3]")
      run(port);
      return;
    }
    if (isInteractive) {
      console.log("[4]")
      clearConsole();
      const existingProcess = getProcessForPort('pid', DEFAULT_PORT);
      const question =
        chalk.yellow(`Something is already running on port ${DEFAULT_PORT}.${((existingProcess) ? ` Probably:\n  ${existingProcess}` : '')}\n\nWould you like to run the app on another port instead?`);

      prompt({
        type: "confirm",
        message: question,
        name: "shouldChangePort",
        default: true
      }).then(({shouldChangePort}) => {
        if (shouldChangePort) {
          run(port);
        }
      });
    } else {
      console.log(chalk.red(`Something is already running on port ${DEFAULT_PORT}.`));
    }
  });
}

init()



