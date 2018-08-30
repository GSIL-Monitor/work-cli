const path = require('path')
const ora = require('ora')
const exists = require("fs").existsSync
const { exec } = require('child_process')

exports.initGitHook = function (root) {
  const spinner = ora('init git hooks')
  spinner.start()
  let gitCommand = 'scp gitr:hooks/commit-msg .git/hooks/'

  if (!exists(path.join(root, '.git'))) {
    gitCommand = 'git init && scp gitr:hooks/commit-msg .git/hooks/'
  }

  return new Promise((resolve, reject) => {
    exec(gitCommand, { cwd: root }, (error) => {
      if (error) {
        spinner.fail(error)
        reject(error)
      } else {
        spinner.succeed('init git hooks complete!')
        resolve(root)
      }
    })
  })
}