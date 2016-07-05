/**
 * Created by lkj on 2016/6/28.
 */
'use strict';
var path = require('path'),
    webpack = require('webpack');

module.exports = {
    //页面入口文件配置
    entry:[
        //'webpack-dev-server/client?http://localhost:3000',
        //'webpack/hot/only-dev-server',
        './public/js/login.js'
    ],
    //入口文件输出配置
    output:{
        path:path.join(__dirname,'public/dist/js'),
        publicPath: '/public/dist/js/',
        filename: "bundle.js"
    },
    externals:{
        //react:'React',
        antd: 'antd'
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['react-hot', 'babel'],
                include: [path.join(__dirname, 'public')]
            },
            { test: /\.js$/, loader: "jsx!babel", include: /public\/js/},
            { test: /\.css$/, loader: "style!css"}
        ]
    },
    plugins: [
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin()
    ]
}