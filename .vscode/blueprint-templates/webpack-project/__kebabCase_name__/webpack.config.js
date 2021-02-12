// node 自帶的模組, 專門處理解析路徑使用
const path = require("path");

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// development 使用開發模式
// production 使用線上模式
const mode = "development";

// development 使用 eval-source-map
// production 使用 nosources-source-map
const devtool =
  mode === "development" ? "eval-source-map" : "nosources-source-map";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// webpack 配置檔案導出 Object, 所以要使用 module exports
module.exports = {
  // 當前使用的 webpack 模式
  // mode: 'development', 使用開發模式
  // mode: 'production', 使用線上模式
  mode: mode,
  // 啟用 sourceMap
  // 建議 development 時使用
  devtool: devtool,
  // 入口文件, 一個頁面應對一個入口文件
  // entry: getEntries(),
  entry: getEntries(),

  // 出口, 文件最後打包的方式與地方
  output: {
    // 打包後的文件名稱
    filename: "js/[name].bundle.js",
    // 文件輸出的路徑
    // __dirname 代表 webpack.config.js 這個文件的當前路徑
    // dist 文件輸出的路徑與資料夾名稱
    path: path.resolve(__dirname, "dist"),
    // 在伺服器上時, 各種資源路徑前加上自己的網域
    // publicPath: "https://www.google.com.tw/"
  },
  // webpack 解析 node 插件時的範圍設置
  resolve: {
    // 只找當前目錄下的 node_modules
    modules: [path.resolve(__dirname, "node_modules")],
  },
  devServer: {
    // 模擬伺服器的目錄
    contentBase: path.join(__dirname, "dist"),
    // 開啟 gzip 壓縮, 可以執行的更快
    compress: true,
    // 開啟 HMR 熱更新
    hot: true,
    // 模擬伺服器的端口
    port: 8080,
    // 將 devServer 的網頁寫入記憶體
    writeToDisk: true,
    // 顯示打包時的進度
    // progress: true,
    // 自動打開瀏覽器
    open: true,
    // 模擬跨域, 配合 json-server 使用
    proxy: {
      "/api": "http//:localhost:8888",
    },
    // 開啟 devServer 時不要顯示 console.log 日誌
    clientLogLevel: "none",
    // 除了基本資訊外, 其他不顯示
    quiet: true,
  },
  // 模組
  module: {
    rules: [
      {
        // 教學說明, 使用 oneOf 可以避免模組執行全部 loader 而只使用適合的
        // 需要注意若模組需要使用兩種 loader 並且需要分開寫設置, 則要將其中一種 loader 放在外面
        // getStyleLoader() getJsLoader() 雖然是多個 loader 但是我寫在一起, 故可以使用 oneOf
        oneOf: [
          getHtmlLoader(),
          getStyleLoader(),
          getJsLoader(),
          getImageLoader(),
          getFontLoader(),
          getMediaLoader(),
        ],
      },
    ],
  },
  // 插件
  plugins: [
    ...getHtmlPlugins(),
    getStylePlugin(),
    ...getWebpackPlugins(),
    getClearPlugin(),
    getFrameworksPlugin(),
  ],
  // 優化選項
  optimization: {
    splitChunks: {
      // 打包的框架需要引用一次
      minChunks: 1,
      cacheGroups: {
        // 抽出框架
        vendor: {
          // 指定是 node_modules 路徑下的框架
          test: /node_modules/,
          chunks: "initial",
          // 打包後的檔案名稱
          name: "vendor",
          // 打包檔案的優先級
          priority: 10,
        },
      },
    },
    minimizer: [getStyleOptimization(), getJsOptimization()],
  },
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// entry js
// 安裝 glob
function getEntries() {
  const glob = require("glob");
  // [ './src/views/index' ]
  const views = glob.sync("./src/views/*");
  const entries = {};

  views.forEach((view) => {
    let key = view.slice(view.lastIndexOf("/") + 1);
    /**
     * [ './src/views/index/index.html',
     * './src/views/index/index.js',
     * './src/views/index/index.scss' ]
     */
    let value = glob.sync("./src/views/" + key + "/*");

    entries[key] = value;
  });

  return entries;
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// html template plugin
// 安裝 html-webpack-plugin
// 安裝 glob
function getHtmlPlugins() {
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const glob = require("glob");
  // ["./src/views/index/index.html"];
  const paths = glob.sync("./src/views/*/*.html");

  // Array.prototype.map 修改陣列原內容, 將新的內容組成新陣列並返回
  return paths.map((path) => {
    // index
    let view = path.slice(path.lastIndexOf("/") + 1, path.lastIndexOf("."));

    return new HtmlWebpackPlugin({
      // 模版路徑
      template: path,
      // 打包後的名稱
      filename: view + ".html",
      // 將 js 放到 body 底部
      inject: true,
      // 多頁面應對各自的 js 時使用
      chunks: [view, "vendor"],
      // 壓縮 html 標籤的選項, production 模式再使用
      minify: {
        // 壓縮成一行
        collapseWhitespace: true,
        // 刪除註釋
        removeComments: true,
      },
    });
  });
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// html loader
// 安裝 html-loader
function getHtmlLoader() {
  return {
    test: /\.(html)$/,
    loader: "html-loader",
    options: {
      attrs: [":src"],
      // 讓 html 頁面可以使用 ${require('./../../components/header/template.html')} 插入 component
      interpolate: true,
    },
  };
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// style loader plugin optimization
// scss -> css -> link -> index.bundle.css
// 安裝 sass sass-loader
// 安裝 css-loader
// 安裝 postcss-loader autoprefixer, 在根目錄新增 postcss.config.js 檔案
// 安裝 mini-css-extract-plugin optimize-css-assets-webpack-plugin
function getStyleLoader() {
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const autoprefixer = require("autoprefixer");
  const afterLoader =
    mode === "development"
      ? "style-loader"
      : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 為練習 build 後, 圖片路徑的修改
            // 可能會配合 output.publicPath 設置資源路徑前的網域
            publicPath: "../",
          },
        };

  return {
    test: /\.(sa|sc|c)ss$/i,
    use: [
      afterLoader,
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [autoprefixer()],
        },
      },
      "sass-loader",
    ],
  };
}

function getStylePlugin() {
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  return new MiniCssExtractPlugin({
    // filename 輸出的檔案路徑與名稱
    filename: "./css/[name].bundle.css",
  });
}

function getStyleOptimization() {
  const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
  return new OptimizeCssAssetsWebpackPlugin();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// js loader ESLint 簡查
// js babel 語法降版
// 安裝 babel-loader @babel/core @babel/preset-env
// 安裝 eslint eslint-loader
function getJsLoader() {
  return {
    test: /\.m?js$/,
    // 排除的路徑
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          // 使用 babel 的暫存
          cacheDirectory: true,
        },
      },
      {
        loader: "eslint-loader",
        options: {
          // 起動暫存
          cache: true,
          // 修復 eslint 認為的錯誤
          fix: true,
        },
      },
    ],
  };
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// js optimization 壓縮
// 安裝 uglifyjs-webpack-plugin
// mode: 'production', 使用線上模式時才生效
function getJsOptimization() {
  const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
  return new UglifyJsPlugin({
    test: /\.m?js$/,
  });
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// file loader image font media
// 安裝 file-loader
function getImageLoader() {
  return {
    test: /\.(png|jpg|jpeg|svg|gif)$/i,
    loader: "file-loader",
    options: {
      // file-loader 獲取檔案後, 產生的名字
      name: "[name].[ext]",
      // build 的路徑
      outputPath: "./images",
    },
  };
}

function getFontLoader() {
  return {
    test: /\.(eot|eot\?\#iefix|woff2|woff|ttf)$/i,
    loader: "file-loader",
    options: {
      // file-loader 獲取檔案後, 產生的名字
      name: "[name].[ext]",
      outputPath: "./fonts",
    },
  };
}

function getMediaLoader() {
  return {
    // 條件外的資源
    exclude: /\.(html|css|sass|scss|js|png|jpg|jpeg|svg|gif|eot|eot\?\#iefix|woff2|woff|ttf)$/i,
    loader: "file-loader",
    options: {
      // file-loader 獲取檔案後, 產生的名字
      name: "[name].[ext]",
      outputPath: "./media",
    },
  };
}

// 暫時不用
// 使用 url-loader
// 用途:可以將容量小的圖片轉為編碼型式(不可轉換容量大的圖片), 已減少伺服器請求次數
// 暫時不用
// let obj = {
//   test: /\.(png|jpg|jpeg|svg|gif)$/i,
//   loader: "url-loader",
//   options: {
//     // 8 kb 以下的圖片轉為編碼型式
//     limit: 8 * 1024,
//     // 圖片轉移後的名稱
//     name: "[name].[hash:10].[ext]",
//     // 圖片名稱改為哈希值 10 位數
//     name: "[ext]",
//     // 不使用 ES6 的模組
//     esModule: false,
//     // build 的路徑
//     outputPath: "./images",
//   },
// };

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// 熱更新, 開發中保存時, 只在頁面上更新有改動的部分
// 需要設置 devServer.hot: true
function getWebpackPlugins() {
  const webpack = require("webpack");
  return [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ];
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// 在 build 時, 自動刪掉 output.path 目錄
// 安裝 clean-webpack-plugin
function getClearPlugin() {
  const CleanWebpackPlugin = require("clean-webpack-plugin");
  return new CleanWebpackPlugin();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

// 在每個模組直接引入框架
function getFrameworksPlugin() {
  const webpack = require("webpack");
  return new webpack.ProvidePlugin({
    $: "jquery",
  });
}

// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
// ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- -----
