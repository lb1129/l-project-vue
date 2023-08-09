<h1 align="center">L-PROJECT-VUE</h1>

<p align="center">一个 vue2 spa脚手架</p>

<p align="center">
  <a href="https://github.com/webpack/webpack">
    <img src="https://img.shields.io/badge/webpack-5.88.1-brightgreen.svg" alt="webpack">
  </a>
  <a href="https://github.com/microsoft/typeScript">
    <img src="https://img.shields.io/badge/typeScript-5.1.6-brightgreen.svg" alt="typeScript">
  </a>
  <a href="https://github.com/jestjs/jest">
    <img src="https://img.shields.io/badge/jest-29.6.1-brightgreen.svg" alt="jest">
  </a>
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.7.14-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/lb1129/l-project-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
</p>

## 介绍

基于 [webpack5](https://github.com/webpack/webpack) , [typeScript5](https://github.com/microsoft/typeScript) , [jest29](https://github.com/jestjs/jest) , [vue2](https://github.com/vuejs/vue) 搭建

## 特性

- 开发环境
- 生产环境
- 测试环境
- 自定义环境变量
- 打包分析
- 生产环境低版本浏览器支持（当前项目内构建的产物可运行在 ie11）
- 代码校验
- git commit msg 校验

## 浏览器兼容处理

- 配置目标浏览器 `.browserslistrc` `[production]`
- 需修正的依赖包 `package.json` `corrected-package`

Tip: 如果第三方依赖包使用的语法不能转换或者 api 不能在目标浏览器 polyfill，则修正无效，可选择切换实现或者抛弃目标浏览器支持

## 外部自定义环境变量

- **.env** 基础环境
- **.env.development** 开发环境
- **.env.production** 生产环境
-

## 开始使用

```sh
# 克隆项目
git clone https://github.com/lb1129/l-project-vue.git

# main.ts app-env.d.ts shims-tsx.d.ts shims-vue.d 这四个文件保留，其余src目录及文件可清空

# main.ts 第一行内容保留，其余内容可清空

# 加入你的内容
```

## License

[MIT](https://github.com/lb1129/l-project-vue/blob/master/LICENSE)
