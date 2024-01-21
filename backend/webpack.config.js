const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/ // Ignore node_modules folder
  ],
  output: {
    filename: 'index.js', // output file
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    modules: ['node_modules']
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
        }
      ]
    }]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    removeAvailableModules: false,
    removeEmptyChunks: false,
  },
};