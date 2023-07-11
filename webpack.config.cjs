const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === 'production'
const IS_ANALYZE = process.env.IS_ANALYZE === 'true'
// 内置环境变量 外部自定义环境变量也扩展到该对象 剥离对process.env的污染
const builtInEnvs = {
  PUBLIC_URL: '/',
  PORT: '9000',
  BUILD_PATH: 'dist',
  GENERATE_SOURCEMAP: 'false'
}

// 加载自定义环境变量
dotenv.config({ path: resolveApp('.env'), processEnv: builtInEnvs, override: true })
dotenv.config({
  path: resolveApp(`.env${NODE_ENV ? `.${NODE_ENV}` : ''}`),
  processEnv: builtInEnvs,
  override: true
})

if (!/\/$/.test(builtInEnvs.PUBLIC_URL)) {
  builtInEnvs.PUBLIC_URL = `${builtInEnvs.PUBLIC_URL}/`
}

// PUBLIC_URL
const PUBLIC_URL = builtInEnvs.PUBLIC_URL
// PORT
const PORT = builtInEnvs.PORT
// BUILD_PATH
const BUILD_PATH = builtInEnvs.BUILD_PATH
// GENERATE_SOURCEMAP
const GENERATE_SOURCEMAP = builtInEnvs.GENERATE_SOURCEMAP === 'true'

const prefixRE = /^L_/
const resolveClientEnv = (raw) => {
  const env = {}
  Object.keys(builtInEnvs).forEach((key) => {
    if (prefixRE.test(key) || key === 'NODE_ENV' || builtInEnvs[key]) {
      env[key] = builtInEnvs[key]
    }
  })
  if (raw) {
    return env
  }
  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }
  return {
    'process.env': env
  }
}

// corrected-package 需修正的不支持目标浏览器的node_modules包
const correctedPackage = require(resolveApp('package.json'))['corrected-package']
let correctedPackageInclude = []
if (correctedPackage && Array.isArray(correctedPackage)) {
  correctedPackageInclude = correctedPackage.map((name) => resolveApp(`node_modules/${name}`))
}

module.exports = {
  entry: [resolveApp('src/main.ts')],
  output: {
    path: resolveApp(BUILD_PATH),
    publicPath: PUBLIC_URL,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    clean: true
  },
  mode: process.env.NODE_ENV,
  devtool: GENERATE_SOURCEMAP
    ? 'source-map'
    : isProduction
    ? false
    : 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolveApp('src'), ...correctedPackageInclude]
      },
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/]
            }
          }
        ]
      },
      {
        // css-loader can auto handle CSS modules
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
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
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource'
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: 'asset'
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 10000
        //   },
        // },
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
  resolve: {
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.mts', '.json', '.vue'],
    alias: {
      '@': resolveApp('src'),
      '~': resolveApp('node_modules')
    }
  },
  cache: {
    type: 'filesystem'
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'vue', 'ts', 'tsx']
    }),
    new ForkTsCheckerWebpackPlugin(),
    new VueLoaderPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin(resolveClientEnv()),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            gitignore: true,
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: resolveApp('public/index.html'),
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options
          },
          ...resolveClientEnv(true)
        }
      }
    }),
    IS_ANALYZE &&
      isProduction &&
      new BundleAnalyzerPlugin({
        generateStatsFile: true
      }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css'
      })
  ].filter(Boolean),
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ]
  },
  stats: 'errors-warnings',
  devServer: {
    open: true,
    static: {
      directory: resolveApp('public'),
      publicPath: PUBLIC_URL,
      watch: true
    },
    compress: true,
    host: '0.0.0.0',
    port: PORT,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    },
    historyApiFallback: {
      disableDotRule: true,
      index: PUBLIC_URL
    },
    setupMiddlewares(middlewares, devServer) {
      // Redirect to `PUBLIC_URL` if url not match
      devServer.app.use((req, res, next) => {
        const servedPath = PUBLIC_URL.slice(0, -1)
        if (servedPath === '' || req.url === servedPath || req.url.startsWith(servedPath)) {
          next()
        } else {
          const newPath = path.posix.join(servedPath, req.path !== '/' ? req.path : '')
          res.redirect(newPath)
        }
      })
      return middlewares
    }
  }
}
