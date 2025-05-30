const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: { main: './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: ''
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader, 
        'css-loader',
        'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
        filename: 'images/[name][ext]'
        }
      },
     {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
        filename: 'fonts/[name][hash][ext]'
        }
     },
     {
        test: /\.html$/,
  use: [
    {
      loader: 'html-loader',
      options: {
        sources: {
          list: [
            // Обрабатываем обычные изображения
            {
              tag: 'img',
              attribute: 'src',
              type: 'src',
              filter: (tag, attr, attrs, resourcePath) => {
                // Игнорировать img с пустым src
                const srcAttr = attrs.find(a => a.name === 'src');
                if (srcAttr && srcAttr.value === '') return false;

                return true;
              }
            }
          ]
        }
      }
    }
  ]
}
    ]
  },		
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
        filename: 'style.css'
    })
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true
  }
};
