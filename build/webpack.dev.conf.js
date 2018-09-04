var webpack = require('webpack')
var path = require('path')
var config = require('./webpack.base.conf.js')
var srcMap = require('../config/src.map')
config = Object.assign({
    mode: "development"
}, config)

// add hot-reload related code to entry chunk
Object.keys(config.entry).forEach(function (name) {
    if (name !== 'vendors'){
        config.entry[name] = [
            'react-hot-loader/patch',
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client?reload=true',
            path.join(__dirname, '../', srcMap.scripts[name])
        ]
    }
})

config.devtool = 'eval-source-map'; // 性能较好
config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
])
module.exports = config
