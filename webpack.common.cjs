const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { resolveApp } = require('./webpack.utils.cjs')

const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'
const IS_ANALYZE = process.env.IS_ANALYZE === 'true'

const getStyleLoader = (preprocessing) => {
  const preset = [
    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    // 对于 .module. 的文件会自动处理 CSS modules
    {
      loader: 'css-loader',
      options: {
        importLoaders: preprocessing ? 2 : 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              // 支持转换高级 CSS 特性
              // 将读取 browserslist 目标浏览器配置
              'postcss-preset-env',
              {
                // 添加浏览器前缀
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              }
            ]
          ]
        }
      }
    }
  ]
  return [...preset, preprocessing]
}

// corrected-package 需修正的不支持目标浏览器的node_modules包
const correctedPackage = require(resolveApp('package.json'))['corrected-package']
let correctedPackageInclude = []
if (correctedPackage && Array.isArray(correctedPackage)) {
  correctedPackageInclude = correctedPackage.map((name) => resolveApp(`node_modules/${name}`))
}

module.exports = ({ PUBLIC_URL, BUILD_PATH, GENERATE_SOURCEMAP, resolveClientEnv }) => {
  return {
    // 入口文件 这里为单入口
    entry: [resolveApp('src/main.ts')],
    // 资源输出配置
    output: {
      // 输出目录
      path: resolveApp(BUILD_PATH),
      // 公共基础路径（资源部署时所处的url路径）
      publicPath: PUBLIC_URL,
      //  bundle的文件名
      filename: 'static/js/[name].[contenthash:8].js',
      // 分包chunk的文件名
      chunkFilename: 'static/js/[name].[contenthash:8].js',
      // 静态资源输出文件名
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      // 在生成文件之前清空 output 目录
      clean: true
    },
    mode: NODE_ENV,
    // sourcemap 配置
    devtool: GENERATE_SOURCEMAP
      ? 'source-map'
      : isProduction
      ? false
      : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.vue$/,
          include: [resolveApp('src')],
          use: ['thread-loader', 'vue-loader']
        },
        {
          test: /\.js$/,
          use: ['thread-loader', 'babel-loader'],
          include: [resolveApp('src'), ...correctedPackageInclude]
        },
        {
          test: /\.tsx?$/,
          include: [resolveApp('src')],
          use: [
            'thread-loader',
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
                transpileOnly: true,
                appendTsSuffixTo: [/\.vue$/]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: getStyleLoader()
        },
        {
          test: /\.less$/,
          use: getStyleLoader('less-loader')
        },
        {
          test: /\.(svg)(\?.*)?$/,
          // 资源模块类型
          type: 'asset/resource'
        },
        {
          test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
          type: 'asset',
          parser: {
            // 转换成base64的最大size
            dataUrlCondition: {
              maxSize: 10000
            }
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset'
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset'
        }
      ]
    },
    performance: IS_ANALYZE
      ? false
      : {
          // warn 500K
          maxAssetSize: 500000,
          maxEntrypointSize: 500000
        },
    // 模块解析配置
    resolve: {
      // 不带文件后缀时，尝试找寻的文件后缀
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.mts', '.json', '.vue'],
      // 路径别名
      alias: {
        '@': resolveApp('src'),
        '~': resolveApp('node_modules')
      }
    },
    // 构建文件系统级别的缓存
    cache: {
      type: 'filesystem',
      // 缓存依赖项（依赖项变更可使缓存失效）
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
        tsconfig: [resolveApp('tsconfig.json')].filter((f) => fs.existsSync(f)),
        env: [
          resolveApp('.env'),
          resolveApp('.env.development'),
          resolveApp('.env.production')
        ].filter((f) => fs.existsSync(f))
      }
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'vue', 'ts', 'tsx']
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true
          }
        }
      }),
      new webpack.ProgressPlugin(),
      new VueLoaderPlugin(),
      // 编译时可替换的变量
      new webpack.DefinePlugin(resolveClientEnv()),
      // 输出html文件 并处理好 js css 等资源的引入
      new HtmlWebpackPlugin({
        template: resolveApp('public/index.html'),
        templateParameters: resolveClientEnv(true)
      })
    ],
    // bundle 信息只在发生错误时输出
    stats: 'errors-warnings'
  }
}
