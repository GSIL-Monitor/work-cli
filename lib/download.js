const path = require('path')
const ora = require('ora')
const child_process = require('child_process')
const util = require('util');
const { repos } = require('../config')
const exec = util.promisify(child_process.exec);
/**
 * 
 * @param {*} target    目标地址
 * @param {*} dev   根据选择的参数下载不同的分支模板
 */
module.exports = function (target, dev) {
  const spinner = ora('downloading template')
  spinner.start()
  // 模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径
  target = path.join(target || '.', '.dcd-temp')
  return new Promise((resolve, reject) => {
    let url = `git clone -b ${dev} ${repos} ${target}`;
    console.log(url);
    exec(url).then(() => {
      spinner.succeed('download complete!'); 
      resolve(target)
    })
  })
}