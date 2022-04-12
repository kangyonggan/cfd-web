<template>
  <div class="order-list">
    <div class="header">
      <span
        :class="{active: activeTab === '0'}"
        @click="changeTab('0')"
      >
        当前持仓
      </span>
      <span
        :class="{active: activeTab === '1'}"
        @click="changeTab('1')"
      >
        当前委托
      </span>
      <span
        :class="{active: activeTab === '2'}"
        @click="changeTab('2')"
      >
        历史持仓
      </span>
      <span
        :class="{active: activeTab === '3'}"
        @click="changeTab('3')"
      >
        历史委托
      </span>
    </div>

    <!--当前持仓-->
    <order-held
      v-if="activeTab === '0'"
      :order-held-list="orderHeldList"
    />

    <!--当前委托-->
    <order-delegate
      v-if="activeTab === '1'"
      :order-delegate-list="orderDelegateList"
    />
  </div>
</template>

<script>
import OrderHeld from "./orders/order-held"
import OrderDelegate from "./orders/order-delegate";

export default {
  components: {OrderDelegate, OrderHeld},
  emits: ['updateOrderAmountInfo'],
  data() {
    return {
      activeTab: localStorage.getItem('orderTab') || '0',
      orderHeldList: [],
      orderDelegateList: [],
    }
  },
  methods: {
    updateOrderHeldList(orderHeldList) {
      this.orderHeldList = orderHeldList
    },
    updateOrderDelegateList(orderDelegateList) {
      this.orderDelegateList = orderDelegateList
    },
    changeTab(tab) {
      this.activeTab = tab
      localStorage.setItem('orderTab', tab)

      this.getOrderDelegate()
    },
    getOrderDelegate() {
      if (this.tab === '1') {
        this.$eventBus.emit('sendAccountMsg', {method: 'REQ', topic: 'ORDER_DELEGATE'})
      }
    }
  },
  mounted() {
    this.getOrderDelegate()

    this.$eventBus.on('updateOrderHeldList', this.updateOrderHeldList)
    this.$eventBus.on('updateOrderDelegateList', this.updateOrderDelegateList)
  }
}
</script>

<style scoped lang="scss">
.order-list {
  clear: both;
  float: left;
  width: calc(100% - 20px);

  .header {
    width: 100%;
    height: 45px;
    padding-left: 10px;
    border-top: 1px solid var(--app-border-color);
    background: var(--app-bg-color-light);

    span {
      display: inline-block;
      height: 43px;
      line-height: 43px;
      padding: 0 5px;
      margin-right: 20px;
      cursor: pointer;
    }

    .active {
      color: var(--app-text-color-white);
      border-bottom: 2px solid var(--el-color-primary);
    }
  }
}
</style>
