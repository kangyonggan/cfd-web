<template>

  <div style="height: 100%">

    <div class="wrapper">

      <navbar />

      <router-view v-slot="{ Component }">

        <keep-alive>

          <el-row>

            <el-col
              :xl="3"
              :lg="1"
              :md="1"
              :sm="1"
              :xs="1" />

            <el-col
              style="padding: 20px"
              :xl="18"
              :lg="22"
              :md="22"
              :sm="22"
              :xs="22">

              <component :is="Component" />
            </el-col>

            <el-col
              :xl="3"
              :lg="1"
              :md="1"
              :sm="1"
              :xs="1" />
          </el-row>
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

  export default {
    components: {Footer, Navbar},
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

  .bullish {
    color: var(--el-color-success)
  }

  .bearish {
    color: var(--el-color-danger)
  }
</style>
