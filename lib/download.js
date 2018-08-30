const path = require('path')
const ora = require('ora')
const { exec } = require('child_process')
const { repos } = require('../config')
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
    exec(`git clone -b ${dev} ${repos} ${target}`, (error) => {
      if (error) {
        spinner.fail(error)
        reject(error)
      } else {
        spinner.succeed('download complete!')
        resolve(target)
      }
    })
  })
}