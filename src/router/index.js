import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/layout.vue'
import NotFound from '../views/404.vue'
import Login from '../views/login.vue'
import Index from '../views/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Index,
      },
      {
        path: 'login',
        component: Login,
      },
      {
        path: '/:catchAll(.*)',
        component: NotFound
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  mode: 'history',
  routes
})

router.beforeEach(async (to, from, next) => {
  // 权限校验
  if (to.meta && to.meta.authorization) {
    if (!checkLogin()) {
      next({
        path: '/login',
      })
      return
    }
  }

  next()
})

function checkLogin() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  return userInfo.token
}

export default router
