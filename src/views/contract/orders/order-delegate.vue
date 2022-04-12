<template>
  <el-table
    :data="orderDelegateList"
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
      prop="triggerPrice"
      label="委托价格"
      min-width="100"
    >
      <template #default="scope">
        {{ scope.row.triggerPrice }}
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
      prop="createTime"
      label="创建时间"
      width="190"
    >
      <template #default="scope">
        {{ DateTimeUtil.format(scope.row.createTime) }}
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
          @click="cancelOrder(scope.row)"
        >
          撤销
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  props: {
    orderDelegateList: {
      required: true,
      type: Array
    }
  },
  methods: {
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
    cancelOrder(row) {
      this.axios.delete('/v1/order?orderNo=' + row.orderNo).then(() => {
        this.$success('撤销成功')
      }).catch(res => {
        this.$error(res.msg)
      })
    }
  }
}
</script>
