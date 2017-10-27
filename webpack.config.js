// 引入依赖
var path = require("path"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  currentTarget = process.env.npm_lifecycle_event,
  OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin"),
  online = false;

if (currentTarget === "build") {
  online = true;
}
var resolve = {
  extensions: [".js", ".ts", ".sass"],
  // 加个别名，加快库的检索速度
  alias: {}
};
var entry = {};
if (online) {
  entry = {
    index: path.join(__dirname, "./webApp/index.ts"),
    regular: ["regularjs","stateman"],
    JR: ["jr-ui"]
  };
} else {
  entry = {
    index: [
      path.join(__dirname, "./webApp/index.ts"),
      "webpack-hot-middleware/client?reload=true"
    ],
    regular: ["regularjs"],
    JR: ["jr-ui"]
  };
}
var output = {
  path: path.join(__dirname, "./dist"),
  publicPath: online ? "/" : "/dist/",
  filename: online ? "js/[name]-[chunkhash:8].js" : "js/[name].js",
  /*
     * 按需加载模块时输出的文件名称
     * */
  chunkFilename: online ? "js/[name]-[chunkhash:8].js" : "js/[name].js"
};

var rules = [
  {
    test: /\.html$/,
    use: "html-loader"
  },
  {
    test: /\.ts$/,
    use: "ts-loader"
  },
  {
    test: /\.(png|gif|jpg|jpeg)$/,
    use: ["url-loader?limit=8196&name=images/[name]-[hash:8].[ext]"]
  },
  {
    test: /\.(eot|woff|woff2|ttf|svg|oft|otf)$/,
    use: "url-loader"
  },
  {
    test: /\.ico$/,
    use: ["file-loader"]
  },
  // {
  //   test: /\.css$/,
  //   include: path.resolve(__dirname, "node_modules/jr-ui/dist/css/"),
  //   use:["file-loader"]
  // },
  {
    test: /\.css$/,
    exclude: path.resolve(__dirname, "node_modules/"),
    use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: [
        {
          loader: "css-loader",
          options: {
            minimize: true
          }
        }
      ]
    })
  },
  {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: "style-loader",
      use: ["css-loader", "sass-loader"]
    })
  }
];

var plugins = [
  // 拷贝资源
  new CopyWebpackPlugin([
    {
      from: path.join(__dirname, "node_modules/jr-ui/dist/css/"),
      to: path.join(__dirname, "dist/css")
    },
    {
      from: path.join(__dirname, "node_modules/jr-ui/dist/fonts"),
      to: path.join(__dirname, "dist/fonts")
    }
  ]),
  new webpack.optimize.CommonsChunkPlugin({
    names: ["JR","regular"],
    minChunks: Infinity
  }),
  new OptimizeCSSPlugin(),
  new webpack.DefinePlugin({}),

  /*
     * 提取css文件到单独的文件中
     */
  new ExtractTextPlugin({
    filename: online ? "css/[name]-[contenthash:8].css" : "css/[name].css",
    allChunks: false
  }),

  /*
     * 创建html文件
     * */
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: path.join(__dirname, "./webApp/index.html"),
    inject: true,
    // 需要依赖的模块
    chunks: ["regular", "JR", "index"],
    // chunksSortMode: "none",
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
    }
  })
];

// 必须在开发环境是使用，这2个函数会导致chunkhash报错
if (!online) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
}

var config = {
  entry: entry,
  resolveLoader: {
    modules: [path.join(__dirname, "node_modules")]
  },
  output: output,
  devtool: false,
  module: {
    rules: rules
  },
  externals: {},
  resolve: resolve,
  plugins: plugins
};

if (online) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  );
} else {
}
module.exports = config;
