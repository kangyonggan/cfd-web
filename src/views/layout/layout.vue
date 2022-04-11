<template>
  <div style="height: 100%">
    <!-- 订阅行情 -->
    <market-ws />

    <!-- 订阅账户 -->
    <account-ws />

    <div class="wrapper">
      <navbar />

      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>

      <div style="height: 60px;clear: both" />
    </div>

    <Footer />
  </div>
</template>

<script>
  import Navbar from "./navbar"
  import Footer from "./footer"
  import AccountWs from "./ws/account-ws";
  import MarketWs from "./ws/market-ws";

  export default {
    components: {AccountWs,MarketWs, Footer, Navbar},
  }
</script>

<style lang="scss">
  html, body, #app {
    height: 100%;
    font-size: 15px;
    background: var(--app-bg-color);
    color: var(--app-text-color);
    margin: 0;
    padding: 0;
    min-width: 1200px;
    font-family: Menlo;
  }

  html {
    overflow-y: scroll; //这是为了兼容ie8，不支持:root, vw。这个可以删掉
  }

  :root {
    overflow-y: auto;
    overflow-x: hidden;
  }

  :root body {
    position: absolute;
  }

  body {
    width: 100vw;
  }

  a:-webkit-any-link {
    color: var(--app-link-color);
  }

  .wrapper {
    min-height: 100%;
    margin-bottom: -61px;
  }

  .main {
    padding: 30px 50px;
  }

  .bullish {
    color: var(--el-color-success)
  }

  .bearish {
    color: var(--el-color-danger)
  }
</style>
