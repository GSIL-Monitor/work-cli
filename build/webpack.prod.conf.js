var webpack = require('webpack')
var WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { SkeletonPlugin } = require('page-skeleton-webpack-plugin-multiple')
const path = require('path')
var config = require('../config/config.js')

function relative(name) {
    return path.resolve(__dirname, '..', name)
}

var config = require('./webpack.base.conf.js')
config = Object.assign({
    mode: "production"
}, config)
var analyze = process.env.analyze || 'reject';
config.plugins = config.plugins.concat([
    // 持久化缓存
    new WebpackInlineManifestPlugin({name: 'webpackManifest'}),

    new SkeletonPlugin({
        routes: [`http://0.0.0.0:9090/${config.path}/index.html`], // 将需要生成骨架屏的路由添加到数组中
        pathname: relative('src'),
        staticDir: relative('dist')
    })
])

if (analyze === 'resolve') {

    config.plugins.push(
        new BundleAnalyzerPlugin()
    );
}
module.exports = config
