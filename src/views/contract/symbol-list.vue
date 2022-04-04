<template>
  <div class="symbol-list">
    <el-table
      v-loading="loading"
      :data="symbolList"
      :row-style="tableRowStyle"
      :cell-style="{padding: '5px'}"
      height="524"
      @row-click="changeSymbol"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
        sortable
        width="120"
      >
        <template #default="scope">
          {{ scope.row.quotationCoin }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastPrice"
        label="最新价"
        sortable
        align="right"
      >
        <template #default="scope">
          <span :class="scope.row.priceColor">
            {{ scope.row.latestPrice }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rose"
        label="今日涨幅"
        sortable
        align="right"
        width="115"
      >
        <template #default="scope">
          <span :style="{color: scope.row.rose > 0 ? 'var(--el-color-success)' : scope.row.rose < 0 ? 'var(--el-color-danger)' : ''}">
            {{ scope.row.rose >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(scope.row.rose) }}%
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  emits: ['updatePrecisionMap', 'updateQuantityPrecisionMap', 'updateSizeMap'],
  data() {
    return {
      loading: false,
      symbolList: [],
      timer: undefined
    }
  },
  methods: {
    tableRowStyle(e) {
      let style = {height: 0, cursor: 'pointer'}
      let symbol = this.$route.query.symbol || 'BTC/USDT'
      if (symbol === e.row.quotationCoin) {
        style.background = 'var(--app-bg-color-light2)'
      }
      return style
    },
    changeSymbol(row) {
      this.$router.push({
        to: '/',
        query: {
          symbol: row.quotationCoin,
          interval: this.interval
        }
      })
    },
    loadSymbolList() {
      this.axios.get('/v1/quotation/list?type=ALL').then(data => {
        for (let i = 0; i < data.length; i++) {
          let oldPrice = this.symbolList[i] ? this.symbolList[i].latestPrice : 0
          data[i].priceColor = oldPrice <= data[i].latestPrice ? 'bullish' : 'bearish'
          data[i].rose = data[i].rate * 1
        }
        this.symbolList = data
      }).catch(res => {
        this.$error(res.msg)
      }).finally(() => {
        this.loading = false
      })
    },
    init() {
      // this.loading = true
      // this.loadSymbolList()
      //
      // this.timer = setInterval(() => {
      //   this.loadSymbolList()
      // }, 3000)
    },
    clear() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = undefined
      }
    }
  },
  activated() {
    this.clear()
    this.init()
  },
  deactivated() {
    this.clear()
  }
}
</script>

<style scoped lang="scss">
.symbol-list {
  width: 330px;
  float: left;
  height: 524px;
  border-right: 1px solid var(--app-border-color);

  .bullish {
    color: var(--el-color-success);
  }
  .bearish {
    color: var(--el-color-danger);
  }
}
</style>
