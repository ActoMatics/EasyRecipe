const path = require('path'),
    htmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['idempotent-babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        // all of the apps code is inside the dist folder
        // thus the src folder is only for dev purposes
        // once we build the app its all merged to the bundle.js 
        contentBase: './dist'
    },
    plugins: [
        // allow us to do complex processing of our input files (index.js)
        // it copies the src/html to the dist/js/html
        new htmlWebPackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    // setting loaders, such as babel
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            }
        ]
    }
};