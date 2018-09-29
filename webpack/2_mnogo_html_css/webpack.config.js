'use strict';

const path = require('path');
//Вебпак сливает все css и html в один js файл. 
// Этот плагин выдаёт css отдельным файлом
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// этот плагин выдаёт html отдельным файлом
const HtmlWebpackPlugin = require('html-webpack-plugin');
//это что-то для работы html страниц
const fs = require('fs');


// new HtmlWebpackPlugin({
//   //   inject: false,
//   //   hash: true,
//   //   template: './frontend/index.html',
//   //   filename: 'index.html'
//   // })
///////////////////////////////////////////////////////////
//функция генерирует отдельные html страницы
function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  console.log(templateFiles);

  var files = [];

  templateFiles.forEach(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    if(!extension || extension != "html") return;

    var newPlugin = new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
    files.push(newPlugin);
  });


  return files;
};

const htmlPlugins = generateHtmlPlugins('./frontend/');
////////////////////////////////////////////////////

module.exports = {
  //ускоряет сборку, работает через eval Без минификации
  mode: 'development',
  // entry: './frontend/app', //какой модуль собирать, у нас home.html
  entry: {
    app: './frontend/app'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    // publicPath: "/", //можно указать корень сервера - (эта директория = корень сервера)
    //переменные вебпака видны снаружи
    library: "home",
    //собирать в этот файл
    // filename: 'build.js'
    filename: '[name].js'
  },

  //смотреть за файлами. Если что-то изменится - вебпак сам перезапустит сборку
  watch: true,

  module: {
    rules: [
        {
            test: /\.js$/,           // .../node_modules/loader!file...
            include: __dirname + '/frontend',
            loader: "babel-loader",
            options: {
                presets: ['es2015']
            }
        }, 
        {
          test: /\.html$/,
          include: path.resolve(__dirname, './frontend/'),
          use: ['raw-loader']
        },
        {
            test: /\.pug$/,
            loader: "pug-loader"
        }, 
        // {
        //   test: /\.pug$/,
        //   use:  [
        //     'html-loader',
        //     {
        //     loader: 'pug-html-loader',
        //     options: {
        //       data: {}
        //     }}
        //   ]
        // },
        {
          test: /\.styl$/,
          // loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
          loader: ExtractTextPlugin.extract({ //отдаём файл препроцессора плагину
            use: 'css-loader!stylus-loader'
          })
      }
    ]
  },
  plugins: [ 
    new ExtractTextPlugin(
      {filename: 'style.css', disable: false, allChunks: true}
    )
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   hash: true,
    //   template: './frontend/index.html',
    //   filename: 'index.html'
    // })
  ].concat(htmlPlugins),
  node: {
      fs: "empty"
  }

  //source maps
  // devtool: "source-map"
  // devtool: "eval-source-map"
}