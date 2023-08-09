const { envHandler } = require('./webpack.utils.cjs')
const { merge } = require('webpack-merge')

const { PUBLIC_URL, PORT, BUILD_PATH, GENERATE_SOURCEMAP, resolveClientEnv } = envHandler()

module.exports = merge(
  require('./webpack.common.cjs')({
    PUBLIC_URL,
    BUILD_PATH,
    GENERATE_SOURCEMAP,
    resolveClientEnv
  }),
  process.env.NODE_ENV === 'production'
    ? require('./webpack.prod.cjs')()
    : require('./webpack.dev.cjs')({
        PUBLIC_URL,
        PORT
      })
)
