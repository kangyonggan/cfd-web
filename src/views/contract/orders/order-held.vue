<template>
  <el-table
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
      prop="orderNo"
      label="订单号"
      min-width="150"
    >
      <template #default="scope">
        {{ scope.row.orderNo.substring(0, 3) }}***{{ scope.row.orderNo.substring(18) }}<base-copy :value="scope.row.orderNo" />
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
    />
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
      width="190"
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
          @click="$refs['order-close'].show(scope.row)"
        >
          平仓
        </span>
      </template>
    </el-table-column>

    <order-close ref="order-close" />
  </el-table>
</template>

<script>
import OrderClose from "../order-close"
import BaseCopy from "@/components/base-copy"

export default {
  components: {BaseCopy, OrderClose},
  props: {
    orderHeldList: {
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
  }
}
</script>
