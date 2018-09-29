'use strict';

const path = require('path');

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
        }, {
            test: /\.pug$/,
            loader: "pug-loader"
        }, {
          test: /\.styl$/,
          loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      }
    ]
  },

  node: {
      fs: "empty"
  }

  //source maps
  // devtool: "source-map"
  // devtool: "eval-source-map"
}