import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { 
      path: '/home', 
      component: Home, 
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
      ]
    },
   ]
});

// 挂载路由导航守卫(如果用户没登录，但是之间通过URL地址访问后台网页，需要重新导航到登录页面)
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个函数跳转来
  // next 是一个函数，表示放行  next() 放行 next('/login)强制跳转

  if (to.path == '/login') next();
  const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login')
    next();
})

/* const router = new VueRouter({
  routes
}) */

export default router
