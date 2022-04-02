<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.code"
    >
      <router-link
        :to="'/wallet/' + item.code"
        :class="{active: code === item.code}"
      >
        {{ item.name }}
      </router-link>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      code: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        items: [{
          code: 'overview',
          name: '钱包总览'
        }, {
          code: 'capital',
          name: '资金账户'
        }, {
          code: 'contract',
          name: '合约账户'
        }]
      }
    }
  }
</script>

<style scoped lang="scss">
  ul {
    float: left;
    width: 300px;
    list-style: none;
    padding-left: 0;
    margin-top: 0;
    border: 1px solid var(--app-border-color);
    border-bottom: 0;

    li {
      a {
        display: inline-block;
        width: calc(100% - 30px);
        padding-left: 30px;
        height: 48px;
        line-height: 48px;
        text-decoration: none;
        color: var(--app-text-color-dark);
        border-bottom: 1px solid var(--app-border-color);
        border-left: 2px solid transparent;
        opacity: 0.9;
      }

      a.active {
        border-left: 2px solid var(--el-color-primary);
        opacity: 1;
        color: var(--app-text-color);
      }
    }
  }
</style>
