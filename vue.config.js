const path = require('path')
require('./build/createIconList.js')

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/admin'
  : '/admin'

// CK配置
// const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
// const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
// require( 'babel-polyfill' )
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config
      .entry('polyfill')
      .add('@babel/polyfill')
      .add('regenerator-runtime/runtime.js')
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('@waste',resolve('src/view/wasteRecovery'))
      .set('@com',resolve('src/view/wasteRecovery/commonComponents'));

    // const svgRule = config.module.rule( 'svg' );
    //
    // svgRule.exclude.add( __dirname + '/node_modules/@ckeditor' );
    config.module
      .rule( 'cke-svg' )
      .test( /iview-admin.src.*?js$/,/ckeditor5-[^\/\\]+[\/\\].*\.js$/)//,/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/
      .use( 'raw-loader','babel-loader')
      .loader( 'babel-loader', 'raw-loader')
    ;
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  // devServer: {
  //   proxy: 'localhost:3000'
  // }
  //vue-cli 3+使用vue-echarts配置
  // 如果IE下还跑不起来，控制台发现有其他es6语法的，尝试调试去找到底是哪个包
  transpileDependencies: [
      'vue-echarts',
      'resize-detector',
      // /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
      'iview',
      'axios',
      'tree-table-vue',
      '@ckeditor/ckeditor5-vue',
      // '@ckeditor/ckeditor5-build-decoupled-document'
      // '@ckeditor'
    ],

  // configureWebpack: {
  //   plugins: [
  //     // CKEditor needs its own plugin to be built using webpack.
  //     new CKEditorWebpackPlugin( {
  //       // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
  //       language: 'en'
  //     } )
  //   ]
  // },

  // css: {
  //   loaderOptions: {
  //     // Various modules in the CKEditor source code import .css files.
  //     // These files must be transpiled using PostCSS in order to load properly.
  //     postcss: styles.getPostCssConfig( {
  //       themeImporter: {
  //         themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
  //       },
  //       minify: true
  //     } )
  //   }
  // },
}
