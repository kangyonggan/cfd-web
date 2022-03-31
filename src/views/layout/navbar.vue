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

    <div
      class="logout"
      v-if="$store.getters.getUserInfo.token"
      @click="logout"
    >
      注销
    </div>

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
  import NavbarMenu from './navbar-menu'
  import Menus from './menus'

  export default {
    components: {NavbarMenu},
    data() {
      return {
        activeIndex: this.$route.path || '/',
        menus: Menus,
      }
    },
    methods: {
      logout() {
        this.axios.delete('/v1/user/logout').finally(() => {
          this.$store.commit("setUserInfo", {})
          this.$router.push('/login')
        })
      }
    },
    watch: {
      '$route'(newRoute) {
        this.activeIndex = newRoute.path
      }
    }
  }
</script>

<style
  scoped
  lang="scss">
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
