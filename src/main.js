/* 
    入口文件 
*/


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入vue-table-with文件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme




// 配置请求的根路径
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

// 对时间的过滤器
Vue.filter('dateFormat', function (time) {
  const dt = new Date(time)

  const date = new Date(time)
    const dateNumFun = (num) => num < 10 ? `0${num}` : num 
    const [y, m, d, hh, mm, ss] = [    // es6 解构赋值
            date.getFullYear(),
            dateNumFun(date.getMonth() + 1),
            dateNumFun(date.getDate()),
            dateNumFun(date.getHours()),
            dateNumFun(date.getMinutes()),
            dateNumFun(date.getSeconds())
        ]

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
