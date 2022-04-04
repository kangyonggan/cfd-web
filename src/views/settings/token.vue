<template>
  <div class="main">
    <sidebar code="token" />

    <div class="content">
      开发中...
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  export default {
    components: {Sidebar}
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 330px);
  }
</style>
