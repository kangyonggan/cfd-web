<template>
  <div class="footer">
    Copyright © {{ DateTimeUtil.format(new Date().getTime(), 'yyyy') }} CFD.
    <el-tooltip
      style="margin-left: 20px;"
      :content="theme === 'light' ? '切到黑夜模式' : '切到白天模式'"
      placement="top"
    >
      <el-icon
        :color="theme === 'light' ? '#555' : '#D5D5D5'"
        :size="22"
        @click="changeTheme"
      >
        <opportunity />
      </el-icon>
    </el-tooltip>
    <el-backtop />
  </div>
</template>

<script>
import {Opportunity} from '@element-plus/icons'

export default {
  components: {Opportunity},
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
}
</style>
