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
      <span
        :class="{active: activeTab === '4'}"
        @click="changeTab('4')"
      >
        资金流水
      </span>

      <span
        class="action"
        v-if="activeTab === '0' && orderHeldList.length"
        @click="closeAll"
      >
        一键平仓
      </span>
      <span
        class="action"
        v-if="activeTab === '1' && orderDelegateList.length"
        @click="cancelAll"
      >
        全部撤销
      </span>
    </div>

    <!--当前持仓-->
    <order-held
      v-show="activeTab === '0'"
      :order-held-list="orderHeldList"
    />

    <!--当前委托-->
    <order-delegate
      v-show="activeTab === '1'"
      :order-delegate-list="orderDelegateList"
    />

    <!--历史持仓-->
    <history-held
      v-show="activeTab === '2'"
      ref="history-held"
    />

    <!--历史委托-->
    <history-delegate
      v-show="activeTab === '3'"
      ref="history-delegate"
    />

    <close-all ref="close-all" />
  </div>
</template>

<script>
import OrderHeld from "./order-held"
import OrderDelegate from "./order-delegate"
import HistoryHeld from "./history-held"
import HistoryDelegate from "./history-delegate"
import CloseAll from "./close-all"

export default {
  components: {OrderDelegate, OrderHeld, HistoryHeld, HistoryDelegate, CloseAll},
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
      if (tab === '4') {
        this.$router.push({
          path: '/wallet/contract',
          query: {
            tab: 1
          }
        })
        return
      }

      this.activeTab = tab
      if (tab === '0') {
        this.$eventBus.emit('sendAccountMsg', {method: 'REQ', topic: 'ORDER_HELD'})
      } if (tab === '1') {
        this.$eventBus.emit('sendAccountMsg', {method: 'REQ', topic: 'ORDER_DELEGATE'})
      } else if (tab === '2') {
        this.$refs['history-held'].reload()
      } else if (tab === '3') {
        this.$refs['history-delegate'].reload()
      }
      localStorage.setItem('orderTab', tab)
    },
    cancelAll() {
      this.$confirm('确定撤销全部的委托单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('/v1/order/cancelAll').then(() => {
          this.$success('撤销成功')
        }).catch(res => {
          this.$error(res.msg)
        })
      })
    },
    closeAll() {
      this.$refs['close-all'].show(this.orderHeldList)
    }
  },
  mounted() {
    this.changeTab(this.activeTab)

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

    .action {
      float: right;
      color: var(--el-color-primary);
      font-size: 13px;
    }
  }
}
</style>
