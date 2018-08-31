var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
// 只支持webpack4
// const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;
var autoprefixer = require('autoprefixer')
var postcssSimpleVars = require('postcss-simple-vars')
var postcssExtend = require('postcss-extend')
var precss = require('precss')
var postcssMixins = require('postcss-mixins')
var cssnano = require('cssnano')
var HtmlWebpackPlugin = require('html-webpack-plugin-for-multihtml')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var WebpackStableModuleIdAndHash = require('webpack-stable-module-id-and-hash')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var NyanProgressPlugin = require('nyan-progress-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin');
var srcPath = relative('src')
var assetsPath = path.resolve(srcPath, 'assets')
var utilsPath = path.join(assetsPath, 'js/utils/utils.js')
var pxtorem = require('postcss-pxtorem')
var mapConfig = require('../config/src.map.js')
var devConfig = require('../config/dev.env.js')
var prodConfig = require('../config/prod.env.js')
const HappyPack = require('happypack');
var sprites = require('postcss-sprites');
// 支持webpack4，把项目按webpack4重新配置
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");

var __DEV__ = process.env.NODE_ENV === 'development'
var __TEST__ = process.env.NODE_ENV === 'test'
var __PROD__ = process.env.NODE_ENV === 'production'

const defaultRuntimeConfig = [
    {
        urlPattern: /https:\/\/s3.pstatp.com\/toutiao\/monitor\/sdk\/slardar.js/,
        handler: 'staleWhileRevalidate',
        options: {
            cacheName: 'slardar-sdk'
        }
    },
    {
        urlPattern: /https:\/\/s3.pstatp.com\/inapp\/lib\/raven.js/,
        handler: 'staleWhileRevalidate',
        options: {
            cacheName: 'raven-sdk'
        }
    },
    {
        urlPattern: /https:\/\/s3.pstatp.com\/pgc\/tech\/collect\/collect-.*/,
        handler: 'cacheFirst',
        options: {
            cacheName: 'tea-sdk'
        }
    }
]

function relative(name) {
    return path.resolve(__dirname, '..', name)
}

var rootPath = relative(''); // 项目根目录

var entries = {}, plugins = [];
resolve_script_entry('', mapConfig.scripts)
resolve_pages(mapConfig.directories.pages, mapConfig.pages)

function resolve_script_entry(path, names) {
    if (!names) { return }
    if (typeof names === 'object' && !Array.isArray(names)) {
        for (let key in names) {
            resolve_script_entry(path + '/' + key, names[key])
        }
        return
    }
    if (!Array.isArray(names)) {
        names = [names]
    }
    path = path.slice(1)
    entries[path] = names.map(name => /\.jsx?$/.test(name) ? relative(name.replace(/%name/g, path)) : name)
}

function resolve_pages(path, files) {
    for (let basename in files) {
        const filename = basename
        const file = files[basename], scripts = file.scripts || {}

        const chunks = []
        for (let key in scripts) {
            const val = scripts[key]
            if (Array.isArray(val)) {
                chunks.push.apply(chunks, val)
            } else {
                chunks.push(val)
                scripts[key] = [val]
            }
        }

        const options = {
            multihtmlCache: true,
            filename: filename,
            template: (path || '') + '/' + (file.source ? file.source.replace(/%name/g, filename) : filename),
            inject: false,
            chunks: chunks,
            head: scripts.head || [],
            body: scripts.body || []
        }

        file.options && Object.assign(options, file.options)
        plugins.push(new HtmlWebpackPlugin(options))
    }
}
var postcssPlugins = []
postcssPlugins.push(
    pxtorem({ rootValue: 50, propWhiteList: [] }),
    postcssSimpleVars(),
    postcssExtend(),
    postcssMixins(),
    precss(),
    // 压缩css和优化css代码
    cssnano()
)

var babelOpts = {
    cacheDirectory: true,
    presets: [
        ["env", {
            "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
            },
            // 开启tree shaking
            "modules": false,
            "loose": true
        }]
        , 'react', 'stage-0'],
    plugins: ['transform-decorators-legacy', 'lodash']
}
if (__DEV__) {
    babelOpts.plugins.push('dva-hmr')
    babelOpts.plugins.push('react-hot-loader/babel')
} else {
    postcssPlugins.push(
        autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'ie >= 8', 'iOS 7', 'Firefox < 10'] })
    )
}
var config = {
    entry: entries,
    output: {
        path: __DEV__ ? relative('dist', devConfig.outputPath) : relative('dist'),
        filename: `js/[name]${__DEV__ ? '' : '_[chunkhash]'}.js`,
        chunkFilename: `js/[name]${__DEV__ ? '' : '_[chunkhash]'}.js`,
        publicPath: __DEV__ ? devConfig.publicPath : prodConfig.publicPath,
    },
    module: {
        rules: [
            { // 在编译之前执行这个loader，如果报错了就不继续
                enforce: 'pre',
                test: /.(js|jsx)$/,
                loader: 'eslint-loader',
                include: relative('src'),
                options: {
                    configFile: relative('src/.eslintrc'),
                    ignoreFile: relative('src/.eslintignore'),
                }
            },
            {
                test: /\.(jsx|js)?$/,
                include: relative('src'),
                use: 'happypack/loader?id=babel',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    use: [
                        {
                            loader: 'fast-css-loader',
                            options: {
                                importLoaders: 1,
                                root: relative('src')
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssPlugins,
                                parser: 'postcss-scss'
                            }
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                include: relative('src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    use: [
                        {
                            loader: 'fast-css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssPlugins,
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(sass|scss)$/,
                include: relative('src'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    publicPath: '../',
                    use: [
                        {
                            loader: 'fast-css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: postcssPlugins,
                            }
                        },
                        'fast-sass-loader'
                    ]
                })
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                include: relative('src'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 2048,
                        name: `image/[name]${__DEV__ ? '' : '_[hash]'}.[ext]`
                    }
                }]
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf)$/,
                include: relative('src'),
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 102400,
                        name: `font/[name]${__DEV__ ? '' : '_[hash]'}.[ext]`
                    }
                }]
            },
            {
                test: /\.(mp4|mp3)$/,
                include: relative('src'),
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `media/[name]${__DEV__ ? '' : '_[hash]'}.[ext]`
                    }
                }]
            },
            {
                test: /\.json$/,
                include: relative('src'),
                use: 'json-loader'
            },
        ],
        // 独完整的 `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
        noParse: [/react\.min\.js$/],
    },
    plugins: plugins.concat([

        // new NyanProgressPlugin(),
        new LodashModuleReplacementPlugin(),
        // 开启 Scope Hoisting
        new webpack.optimize.ModuleConcatenationPlugin(), // Scope Hoisting https://zhuanlan.zhihu.com/p/27980441
        new CleanWebpackPlugin(['dist'], {
            root: rootPath
        }),

        new GenerateSW({
            swDest: "sw.js",
            include: [/\.css$/, /\.js$/, /\.png$/, /\.jpg$/],
            runtimeCaching: defaultRuntimeConfig
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            __DEV__,
            __TEST__,
            __PROD__,
        }),

        new ExtractTextPlugin({
            filename: `css/[name]${__DEV__ ? '' : '_[contenthash]'}.css`,
            allChunks: true,
            disable: __DEV__
        }),

        new webpack.HashedModuleIdsPlugin(),  // 优化hash值=>缓存优化

        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: [{
                loader: 'babel-loader',
                options: babelOpts
            }]
        }),
        function () {
            this.plugin("done", function (stats) {
                require("fs").writeFileSync(
                    path.join(__dirname, "../", "stats.json"),
                    JSON.stringify(stats.toJson()));
            });
        }
    ]),
    resolve: {
        extensions: ['.js', '.jsx', '.less'],
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        // 其中 __dirname 表示当前工作目录，也就是项目根目录
        modules: [path.resolve(__dirname, '../node_modules')],
        // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤, 为了 tree shaking， 增加入口'jsnext:main', 'browser'
        mainFields: ['jsnext:main', 'browser', 'main', 'index'],
        alias: {
            // 路径别名
            SRC: relative('src'),
            Asset: relative('src/assets'),
            Page: relative('src/pages'),
            Pagelet: relative('src/pagelets'),
            Component: relative('src/components'),
            Util: relative('src/utils'),
            Service: relative('src/services')
        },
    }
}

module.exports = config
