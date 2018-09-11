const Metalsmith = require("metalsmith")
const Handlebars = require("handlebars")
const minimatch = require('minimatch')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const rm = require("rimraf").sync

module.exports = function ({metadata = {}, src, dest = "."}) {
  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  const spinner = ora('building ...')
  spinner.start()
  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(process.cwd()) // name of current working 
      .metadata(metadata)                        // add any variable you want, use them in layout-files
      .clean(false)                              // clean destination before
      .source(src)                               // source directory
      .destination(dest)                         // destination directory

      // 判断下载的项目模板中是否有template.ignore
      const ignoreFile = path.join(src, 'template.ignore')
      
      if (fs.existsSync(ignoreFile)) {
        // 定义一个用于移除模板中被忽略文件的metalsmith插件
        metalsmith.use((files, metalsmith, done) => {
          const meta = metalsmith.metadata()
          // 先对ignore文件进行渲染，然后按行切割ignore文件的内容，拿到被忽略清单
          const ignores = Handlebars.compile(fs.readFileSync(ignoreFile).toString())(meta)
            .split('\n').filter(item => !!item.length)
          Object.keys(files).forEach(fileName => {
            // 移除被忽略的文件
            ignores.forEach(ignorePattern => {
              if (minimatch(fileName, ignorePattern)) {
                delete files[fileName]
              }
            })
          })
          done()
        })
      }

      metalsmith.use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        const include = ['package.json']
        include.forEach(item => {
          if(files[item]){
            const t = files[item].contents.toString()
          files[item].contents = new Buffer(Handlebars.compile(t)(meta))
          }
        })
        // Object.keys(files).forEach(fileName => {
        //   const t = files[fileName].contents.toString()
        //   files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
        // })
        done()
      })
      .build(err => {
        rm(src)
        if (err) {
          spinner.fail('build failed :(')
          reject(err)
        } else {
          spinner.succeed('build success :)')
          resolve()
        }
      });
  });
};
