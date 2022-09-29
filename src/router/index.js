import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/layout.vue'
import NotFound from '../views/404.vue'
import Login from '../views/login.vue'
import Index from '../views/index.vue'
import Contract from '../views/contract/index.vue'
import SettingsProfile from '../views/settings/profile.vue'
import SettingsSafety from '../views/settings/safety.vue'
import SettingsToken from '../views/settings/token.vue'
import SettingsNotifications from '../views/settings/notifications.vue'
import SettingsAccount from '../views/settings/account.vue'
import WalletOverview from '../views/wallet/overview.vue'
import WalletCapital from '../views/wallet/capital.vue'
import WalletContract from '../views/wallet/contract.vue'
import WalletContractStat from '../views/wallet/contract-stat.vue'

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
        path: 'contract',
        component: Contract,
        meta: {
          title: '合约'
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
        path: 'settings',
        redirect: '/settings/profile',
      },
      {
        path: 'settings/profile',
        component: SettingsProfile,
        meta: {
          title: '个人信息',
          authorization: true
        }
      },
      {
        path: 'settings/account',
        component: SettingsAccount,
        meta: {
          title: '账户管理',
          authorization: true
        }
      },
      {
        path: 'settings/safety',
        component: SettingsSafety,
        meta: {
          title: '账户安全',
          authorization: true
        }
      },
      {
        path: 'settings/notifications',
        component: SettingsNotifications,
        meta: {
          title: '消息通知',
          authorization: true
        }
      },
      {
        path: 'settings/token',
        component: SettingsToken,
        meta: {
          title: 'Token',
          authorization: true
        }
      },
      {
        path: 'wallet',
        redirect: '/wallet/overview',
      },
      {
        path: 'wallet/overview',
        component: WalletOverview,
        meta: {
          title: '钱包总览',
          authorization: true
        }
      },
      {
        path: 'wallet/capital',
        component: WalletCapital,
        meta: {
          title: '资金账户',
          authorization: true
        }
      },
      {
        path: 'wallet/contract',
        component: WalletContract,
        meta: {
          title: '合约账户',
          authorization: true
        }
      },
      {
        path: 'wallet/contract/stat',
        component: WalletContractStat,
        meta: {
          title: '盈亏分析',
          authorization: true
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
