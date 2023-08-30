import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// main.js文件中引入并全局注册


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}


Vue.use(ElementUI)
Vue.config.productionTip = false

import VueAMap from "vue-amap"
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: "71f9d3ff2bae2738a220ac54af543b4c",
  plugin: [
    "AMap.Autocomplete", //输入提示插件
    "AMap.PlaceSearch", //POI搜索插件
    "AMap.Scale", //右下角缩略图插件 比例尺
    "AMap.OverView", //地图鹰眼插件
    "AMap.ToolBar", //地图工具条
    "AMap.Geolocation", //定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder"// 逆地理编码,通过经纬度获取地址所在位置详细信息
    // 根据需求选用
  ],
  uiVersion: "1.0", // 地图ui版本
  v: '1.4.4' // amap版本
})

window._AMapSecurityConfig = {
  securityJsCode: '0b4448a07b0dfa5cc1fad37c5d9dd13b',
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
