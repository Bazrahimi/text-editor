// importing necessary plugins and modules for webpack configuration
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.
// configur webpack
module.exports = () => {
  return {
    mode: 'development',
    // entry points for the application
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    // output congiguration for the bundle webpack will generate
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // plugins used by webpack to generate HTML files, extract CSS into separate files, and inject the service worker.
    plugins: [
      // Generate an HTML file from a template, includes webpack bundles in the generated HTML
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Text Editor',
      }),
      // extract CSS into separate files. it crate a CSS file per JS file which  contain CSS.
      new MiniCssExtractPlugin(),
      // InjectManifest plugin for workbox will generate a service worker file that precache and route requests
      new InjectManifest({
        swSrc: './src/js/src-sw.js', // specify the source service worker file
        swDest: 'src-sw.js', // Destination filename in the ouptput directory.
      }),

      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: "Just Another Text Editor",
        short_name: "J.A.T.E",
        description: "offline text editor",
        background_color: "#225ca3",
        theme_color: "#225ca3",
        start_url: "/",
        publicPath: "/",
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"),
          },
        ],
      }),

      
    ],
    // Module rules tell webpack how to handle different type of modules
    module: {
      rules: [
        {
          // Rules for CSS file: use miniCssExtractPlugin to extract CSS into separate files.
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
  };
};
