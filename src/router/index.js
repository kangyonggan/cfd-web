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
        meta: {
          title: '首页'
        }
      },
      {
        path: 'login',
        component: Login,
        meta: {
          title: '登录'
        }
      },
      {
        path: '/:catchAll(.*)',
        component: NotFound,
        meta: {
          title: '404'
        }
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

  let title = to.meta.title || ''
  document.title = title + ' - CFD'

  next()
})

function checkLogin() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  return userInfo.token
}

export default router
