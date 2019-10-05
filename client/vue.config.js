//此文件本来不存在，自创建的文件，并且必须命名为这个文件名
const webpack = require("webpack");
const path = require("path");



module.exports = {
    outputDir:path.resolve(__dirname,"dist"),
    // baseUrl:"/",
    publicPath: '/', // 设置打包文件相对路径 与baseUrl只取其一，
    assetsDir:"asset" ,//静态资源目录
    lintOnSave:false,  //是否开启eslint的"保存时语法检测" 值：true false "error"
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    runtimeCompiler: true,
    devServer: {
        // open: process.platform === 'darwin',
        // host: 'localhost',   //主机名
        // https:true,
        hotOnly:true, //热更新
        port: 8081,
        open: false, //配置自动启动浏览器
        proxy: {    //注意重启
            '/api': {
                target: 'http://127.0.0.1:5000/', //对应自己的接口
                changeOrigin: true,    //是否跨域
                ws: true,
                secure:true ,  //开启https
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}
