const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

// 解析路径
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
exports.resolveApp = resolveApp

// 处理环境变量
const envHandler = () => {
  // 内置环境变量 外部自定义环境变量也扩展到该对象 剥离对process.env的污染
  const builtInEnvs = {
    PUBLIC_URL: '/',
    PORT: '9000',
    BUILD_PATH: 'dist',
    GENERATE_SOURCEMAP: 'false'
  }

  // 加载自定义环境变量
  const NODE_ENV = process.env.NODE_ENV
  dotenv.config({ path: resolveApp('.env'), processEnv: builtInEnvs, override: true })
  dotenv.config({
    path: resolveApp(`.env${NODE_ENV ? `.${NODE_ENV}` : ''}`),
    processEnv: builtInEnvs,
    override: true
  })

  // 非 / 结尾
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

  // 自定义环境变量 仅加载以 L_ 开头的
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

  return { PUBLIC_URL, PORT, BUILD_PATH, GENERATE_SOURCEMAP, resolveClientEnv }
}
exports.envHandler = envHandler
