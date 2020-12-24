// require( 'babel-polyfill' )
module.exports = {
  presets: [
    ['@vue/app', {
      useBuiltIns: 'entry', // src全局es5编译
      loose: true
    }],
    [ require( '@babel/preset-env' ) ]
  ]
}
