var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
//var BowerWebpackPlugin = require("bower-webpack-plugin");
var dotenv = require('dotenv'); //pm2 environment files
// var Promise = require('es6-promise').Promise;

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/app');

dotenv.config()
const exposed = [
  'NODE_ENV',
  'AWS_REGION',
  'AWS_USERPOOLID',
  'AWS_IDENTITYPOOLID',
  'AWS_CLIENTAPP',
  'HEYDOC_SERVICES_BASE_URL',
  'SYSTEM_TIMEOUT',
  'AWS_COGNITO_IDENTITYPOOLID',
  'AWS_MOBILEANALYTICS_APPID',
  'AWS_MOBILEANALYTICS_APPTITLE',
  'HEALTHCHECK_INTERVAL',
  'BRANCH_IO_APP_LINK'
]
const exposedEnvironment = {}
exposed.forEach(i => { exposedEnvironment[i] = JSON.stringify(process.env[i]) })

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body',
  hash: true
});

var config = {
  entry: ['babel-polyfill', APP_DIR + '/index.js'],
  devtool: "source-map",
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
    // filename: '[name].[chunkhash].js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        exclude: /node_modules/,
        loader : ["babel-loader"]
      }
/*    ,
      {
        test:   /\.css$/,
        loader: "style!css"
      }
*/
    ]
  },
  //plugins: [HTMLWebpackPluginConfig, new BowerWebpackPlugin()]
  plugins: [HTMLWebpackPluginConfig,
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.DefinePlugin({
      'process.env': exposedEnvironment
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest'
    // }),
    // new webpack.ProvidePlugin({
    //   Promise: 'es6-promise-promise',
    // })
  ],
  devServer: {
    compress: false,
    disableHostCheck: true
 } 
};

module.exports = config;
