import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login', //重定向到/login
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children:[
      {
        path: '/users',
        name: 'Users',
        component: () => import('../components/user/Users')
      },
      {
        path: "/books",
        component: () => import('../components/book/Book')
      },
      {
        path: "/orders",
        component: () => import('../components/order/Order')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('../components/role/Roles.vue')
      },
      {
        path: '/menus',
        name: 'Menus',
        component: () => import('../components/menu/Menus.vue')
      },
      {
        path: '/apis',
        name: 'Apis',
        component: () => import('../components/api/Apis.vue')
      },
      {
        path: "/3001",
        component: () => import('../views/3001.vue')
      },
      {
        path: "/404",
        component: () => import('../views/404.vue')
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
