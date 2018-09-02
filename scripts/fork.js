var { fork } = require('child_process')
var { RESTART } = require('./signal')

function send(message) {
  if (process.send) {
    process.send(message);
  }
}

// 通过子进程启动webpack
function start(devScriptPath) {
  // 在子进程中执行webpack，得到返回的句柄
  const devProcess = fork(devScriptPath, process.argv.slice(2));
  // 监听message，发送的重启信号
  devProcess.on('message', type => {
    console.log(type)
    // 监听到重启信号
    if (type === RESTART) {
      // 发送自杀信号，杀掉子进程
      devProcess.kill('SIGINT');
      // 重新启动server
      start(devScriptPath);
    }
    // 发送type给子进程
    send(type);
  });
}


module.exports = {
  start,
  send
}
