import Vue from 'vue'
import { Form, FormItem,Button, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 要全局挂载
Vue.prototype.$message = Message
