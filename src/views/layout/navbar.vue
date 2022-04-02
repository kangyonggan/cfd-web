<template>
  <div class="navbar">
    <router-link to="/">
      <div class="logo">
        <img
          alt="logo"
          src="../../assets/imgs/logo.png"
        >
      </div>
    </router-link>

    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      router
      unique-opened
    >
      <navbar-menu
        v-for="menu in menus"
        :menu="menu"
        :key="menu.path"
      />
    </el-menu>

    <el-dropdown
      v-if="$store.getters.getUserInfo.token"
      trigger="click"
      class="profile"
      @command="handleCommand"
    >
      <span class="avatar">
        <img
          alt="avatar"
          :src="$store.getters.getUserInfo.avatar ? axios.defaults.baseURL + $store.getters.getUserInfo.avatar : defaultAvatar"
        >
        <el-icon>
          <arrow-down />
        </el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            command="/settings"
          >
            <el-icon>
              <user />
            </el-icon>
            个人信息
          </el-dropdown-item>
          <el-dropdown-item
            command="/wallet"
          >
            <el-icon>
              <Coin />
            </el-icon>
            我的钱包
          </el-dropdown-item>
          <el-dropdown-item
            command="/login"
            divided
          >
            <el-icon>
              <Switch />
            </el-icon>
            切换账号
          </el-dropdown-item>

          <el-dropdown-item command="logout">
            <el-icon>
              <switch-button />
            </el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <router-link
      v-else
      to="/login"
      class="logout"
    >
      登录
    </router-link>
  </div>
</template>

<script>
  import {ArrowDown, Switch, SwitchButton, User, Coin} from '@element-plus/icons'
  import NavbarMenu from './navbar-menu'
  import Menus from './menus'
  import DefaultAvatar from '../../assets/imgs/default.png'

  export default {
    components: {NavbarMenu, ArrowDown, Switch, SwitchButton, User, Coin},
    data() {
      return {
        activeIndex: this.$route.path || '/',
        menus: Menus,
        defaultAvatar: DefaultAvatar
      }
    },
    methods: {
      logout() {
        this.axios.delete('/v1/user/logout').finally(() => {
          this.$store.commit("setUserInfo", {})
          this.$router.push('/login')
        })
      },
      handleCommand: function (command) {
        if (command === 'logout') {
          this.logout()
        } else {
          this.$router.push(command)
        }
      },
    },
    watch: {
      '$route'(newRoute) {
        this.activeIndex = newRoute.path
      }
    }
  }
</script>

<style scoped lang="scss">
  .navbar {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid var(--app-border-color);

    .logo {
      float: left;
      margin-left: 10px;

      img {
        margin: 13px 0 0 10px;
        height: 34px;
        float: left;
      }
    }

    .el-menu {
      width: calc(100% - 280px);
      float: left;
      margin-left: 20px;

      .el-menu-item {
        font-size: 15px;
      }
    }

    .profile {
      .avatar {
        img {
          border-radius: 50%;
          height: 30px;
          width: 30px;
          float: left;
          margin-top: 15px;
        }

        i {
          margin-right: 10px;
          margin-left: 3px;
          margin-top: 23px;
        }
      }
     }

    .logout {
      float: right;
      margin-right: 20px;
      margin-left: 10px;
      line-height: 60px;
      color: var(--el-color-primary);
      text-decoration: none;
      cursor: pointer;
    }

    .el-dropdown {
      float: right;
      margin-right: 10px;
    }
  }
</style>
