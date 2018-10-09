var webpack = require('webpack')
var path = require('path')
var config = require('./webpack.base.conf.js')
config = Object.assign({
    mode: "development"
}, config)

// add hot-reload related code to entry chunk
Object.keys(config.entry).forEach(function (name) {
    if (name !== 'vendors'){
        config.entry[name] = [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client?reload=true',
            config.entry[name]
        ]
    }
})

config.devtool = 'eval-source-map'; // 性能较好
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
])
module.exports = config
