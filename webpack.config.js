const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')


module.exports = {
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename: './js/bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                options: {
                    presets: ['@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                  }
         
            },
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[{
                        loader: 'css-loader'
                    }],
                    publicPath: '../'
                })
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            },
            {
                test:/\.(jpg|gif|png)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:10,
                            name:'[name].[ext]',
                            outputPath: './images',
                        }
                    }
                ]
                
            },
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: true
        }),
        new ExtractTextPlugin('./css/bundle.css'),
    ] ,
    mode:'production'
};