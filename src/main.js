// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import axios from '@/libs/api.request'
import base from '@/libs/base'

import ECharts from 'vue-echarts/components/ECharts'
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/tooltip");
import 'echarts/lib/chart/line'  //折线图
import 'echarts/lib/chart/gauge'  //仪表盘
import 'echarts/lib/chart/pie'  //饼图
import 'echarts/lib/chart/bar'  //柱状图

// 百度地图
// import BaiduMap from 'vue-baidu-map'
// Vue.use(BaiduMap, {
//   ak: '8BB7F0E5C9C77BD6B9B655DB928B74B6E2D838FD'
// })
Vue.component('chart', ECharts)

//ckeditor
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use(CKEditor);

// 兼容ie配置
import '@babel/polyfill'
Vue.prototype.axios = axios;
// 实际打包时应该不引入mock
/* eslint-disable */
 // if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
/*全局打印注入 开始*/
// import page from '@/view/iwcs/print/print.js'
Vue.use(base)
// Vue.use(page)
/*全局打印注入 结束*/
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
