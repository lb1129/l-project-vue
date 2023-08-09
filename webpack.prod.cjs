const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const IS_ANALYZE = process.env.IS_ANALYZE === 'true'

module.exports = () => {
  const config = {
    plugins: [
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
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css'
      })
    ],
    // 优化项配置
    optimization: {
      // 是否压缩
      minimize: true,
      // 压缩工具
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false
            }
          },
          // 是否将注释剥离到单独的文件中
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ]
    }
  }
  if (IS_ANALYZE) {
    config.plugins.unshift(
      new BundleAnalyzerPlugin({
        generateStatsFile: true
      })
    )
    config.performance = false
  }
  return config
}
