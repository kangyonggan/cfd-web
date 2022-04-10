<template>
  <div class="footer">
    <span style="margin-right: 20px;">
      Copyright © {{ DateTimeUtil.format(new Date().getTime(), 'yyyy') }} CFD
    </span>
    <el-icon
      style="vertical-align: middle"
      v-if="theme === 'light'"
      :size="22"
      @click="changeTheme"
    >
      <Moon />
    </el-icon>
    <el-icon
      style="vertical-align: middle"
      v-else
      :size="22"
      @click="changeTheme"
    >
      <Sunny />
    </el-icon>
  </div>
</template>

<script>
import {Sunny, Moon} from '@element-plus/icons'

export default {
  components: {Sunny, Moon},
  data() {
    return {
      theme: localStorage.getItem('theme') || 'light'
    }
  },
  methods: {
    changeTheme() {
      if (this.theme === 'light') {
        this.theme = 'dark'
      } else {
        this.theme = 'light'
      }
      localStorage.setItem('theme', this.theme)
      document.documentElement.setAttribute('theme', this.theme);
    }
  },
  mounted() {
    document.documentElement.setAttribute('theme', this.theme);
  }
}
</script>

<style scoped lang="scss">
.footer {
  height: 60px;
  line-height: 60px;
  color: var(--app-text-color-dark);
  border-top: 1px solid var(--app-border-color);
  text-align: center;
  min-width: 1320px;
}
</style>
