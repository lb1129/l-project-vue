module.exports = {
  plugins: [['@babel/plugin-proposal-decorators', { version: 'legacy' }]],
  presets: [
    [
      // 根据browserslist.production配置转目标浏览器语法
      '@babel/preset-env',
      {
        // 目标浏览器不支持的api polyfill
        // usage会破坏源文件结构 导致有些包无法运行
        useBuiltIns: 'entry',
        corejs: '3.0'
      }
    ],
    '@vue/babel-preset-jsx'
  ],
  env: {
    // 测试环境
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        '@vue/babel-preset-jsx'
      ]
    }
  }
}
