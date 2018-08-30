const chalk = require('chalk')
const logSymbols = require('log-symbols')

exports.success = function (text) {
  console.log(logSymbols.success, chalk.green(text))
}

exports.error = function (text) {
  console.log(logSymbols.error, chalk.red(text))
}

exports.warning = function (text) {
  console.log(logSymbols.warning, chalk.yellow(text))
}

exports.info = function (text) {
  console.log(logSymbols.info, chalk.blue(text))
}

exports.empty = function () {
  console.log()
}

exports.time = function (text) {
  const time = `[${new Date().toLocaleString().split(" ")[1]}]`
  console.log(chalk.green(time), text)
}