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

    <!--持仓中-->
    <el-table
      v-loading="loading"
      v-if="activeTab === '0'"
      :data="orderHeldList"
      :cell-style="{padding: '5px 0'}"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
        min-width="100"
      >
        <template #default="scope">
          <div style="cursor: pointer;">
            <span
              style="color: var(--el-color-primary)"
              @click="changeSymbol(scope.row.quotationCoin + scope.row.marginCoin)"
            >
              {{ scope.row.quotationCoin }}
            </span>
            <span style="font-size: 12px;color: var(--app-text-color-dark)">/{{ scope.row.marginCoin }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="positionSide"
        label="方向"
        min-width="100"
      >
        <template #default="scope">
          <span :class="scope.row.positionSide === 'LONG' ? 'bullish' : 'bearish'">
            {{ scope.row.positionSide === 'LONG' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="margin"
        label="保证金"
        min-width="110"
      />
      <el-table-column
        prop="openPrice"
        label="开仓价格"
        min-width="100"
      >
        <template #default="scope">
          {{ scope.row.openPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastPrice"
        label="最新价格"
        min-width="100"
      >
        <template #default="scope">
          <span v-if="scope.row.lastPrice !== undefined">
            {{ scope.row.lastPrice }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unsettleProfit"
        label="未实现盈亏"
        min-width="170"
      >
        <template #default="scope">
          <span
            :class="scope.row.profitClass"
            v-if="scope.row.profit"
          >
            {{ scope.row.addIcon }}{{ NumberUtil.formatUsdt(scope.row.profit) }}({{ scope.row.profitRate }})
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="强平价格"
        min-width="110"
      >
        <template #default="scope">
          <span v-if="scope.row.forceClosePrice !== undefined">
            {{ scope.row.forceClosePrice }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="止盈/止损"
        min-width="130"
      >
        <template #default="scope">
          {{ scope.row.profitPrice || '--' }}/{{ scope.row.lossPrice || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="openTime"
        label="开仓时间"
        width="175"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.openTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="120"
      >
        <template #default="scope">
          <span
            style="color: var(--el-color-primary);cursor: pointer"
            @click="closeOrder(scope.row)"
          >
            平仓
          </span>
        </template>
      </el-table-column>
    </el-table>

    <order-close ref="order-close" />
  </div>
</template>

<script>
import OrderClose from "./order-close"

export default {
  components: {OrderClose},
  emits: ['updateOrderAmountInfo'],
  data() {
    return {
      loading: false,
      activeTab: localStorage.getItem('orderTab') || '0',
      orderHeldList: [],
      quotationMap: {},
    }
  },
  methods: {
    closeOrder(row) {
      this.$refs['order-close'].show(row)
    },
    updateOrderHeldList(orderHeldList) {
      this.orderHeldList = orderHeldList
    },
    changeSymbol(symbol) {
      this.$router.push({
        path: '/contract',
        query: {
          symbol: symbol,
          interval: this.$route.query.interval
        }
      })
      scrollTo(0, 0)
    },
    changeTab(tab) {
      this.activeTab = tab
      localStorage.setItem('orderTab', tab)
    }
  },
  mounted() {
    this.$eventBus.on('updateOrderHeldList', this.updateOrderHeldList)
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
