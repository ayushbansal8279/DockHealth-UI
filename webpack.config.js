const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'src/app');

dotenv.config();
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
  'BRANCH_IO_APP_LINK',
];
const exposedEnvironment = {};
exposed.forEach(i => {
  exposedEnvironment[i] = JSON.stringify(process.env[i]);
});

const config = {
  entry: ['@babel/polyfill', `${APP_DIR}/index.js`],
  devtool: 'inline-cheap-source-map',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        exclude: /node_modules/,
        loader: ['babel-loader'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.DefinePlugin({
      'process.env': exposedEnvironment,
    }),
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body',
      hash: true,
    }),
  ],
  devServer: {
    compress: false,
    disableHostCheck: true,
  },
};

module.exports = config;
