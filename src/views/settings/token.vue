<template>
  <div>
    <sidebar code="token" />

    <div class="content">
      token
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
    width: calc(100% - 370px);
    border: 1px solid var(--app-border-color);
    padding: 20px;
  }
</style>
