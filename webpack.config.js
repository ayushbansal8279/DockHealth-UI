/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
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
  'PUSHER_APP_KEY',
  'PUSHER_CLUSTER_NAME',
  'SUBSCRIPTION_TOKEN_API_KEY',
  'GA_TRACKING_CODE',
  'GA_TRACKING_CODE_ROLLUP',
  'HELLOSIGN_CLIENT_ID',
  'HELLOSIGN_DOMAIN_VERIFICATION_ENABLED',
  'INTERCOM_APP_CODE',
  'PHONE_COUNTRY_CODES',
];
const exposedEnvironment = {};
exposed.forEach(i => {
  exposedEnvironment[i] = JSON.stringify(process.env[i]);
});

const config = (environment, options) => {
  const isDevelopment = options.mode === 'development';

  return {
    entry: ['@babel/polyfill', `${APP_DIR}/index.jsx`],
    // devtool: isDevelopment ? 'inline-cheap-source-map' : false,
    devtool: isDevelopment ? 'eval-source-map' : false,
    output: {
      path: BUILD_DIR,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          include: APP_DIR,
          exclude: /node_modules/,
          loader: ['babel-loader'],
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.(png|svg|ttf|gif)$/,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': exposedEnvironment,
      }),
      new HtmlWebpackPlugin({
        template: `${__dirname}/src/index.html`,
        filename: 'index.html',
        inject: 'body',
        hash: true,
      }),
      new MomentLocalesPlugin(),
      // isDevelopment && new UnusedFilesWebpackPlugin(),
      isDevelopment &&
        new BundleAnalyzerPlugin({
          openAnalyzer: false,
        }),
      // new CompressionPlugin({
      //   filename: '[path].gz[query]',
      //   algorithm: 'gzip',
      //   test: /\.js$|\.css$|\.html$/,
      //   minRatio: 0.8,
      // }),
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[/\\]node_modules[/\\](@react-pdf|yoga-layout-prebuilt|pdfjs-dist|react-pdf)[/\\]/,
            name: 'pdf',
            chunks: 'all',
          },
        },
      },
      minimize: !isDevelopment,
    },
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.ts',
        '.tsx',
        '.png',
        '.svg',
        '.ttf',
      ],
      alias: {
        actions: path.resolve(__dirname, 'src/app/actions'),
        api: path.resolve(__dirname, 'src/app/api'),
        components: path.resolve(__dirname, 'src/app/components'),
        helpers: path.resolve(__dirname, 'src/app/helpers'),
        hooks: path.resolve(__dirname, 'src/app/hooks'),
        img: path.resolve(__dirname, 'src/app/img'),
        reducers: path.resolve(__dirname, 'src/app/reducers'),
        views: path.resolve(__dirname, 'src/app/views'),
        styles: path.resolve(__dirname, 'src/app/styles'),
        modal: path.resolve(__dirname, 'src/app/modal'),
        selectors: path.resolve(__dirname, 'src/app/selectors'),
        alert: path.resolve(__dirname, 'src/app/alert'),
        sagas: path.resolve(__dirname, 'src/app/sagas'),
        routing: path.resolve(__dirname, 'src/app/routing'),
        location: path.resolve(__dirname, 'src/app/location'),
      },
    },
    devServer: {
      compress: false,
      disableHostCheck: true,
      hot: false,
      liveReload: true,
    },
    watchOptions: {
      poll: 1000,
      ignored: ['node_modules'],
    },
  };
};

module.exports = config;
