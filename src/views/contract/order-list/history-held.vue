<template>
  <div>
    <el-table
      v-loading="loading"
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
          {{ scope.row.orderNo.substring(0, 3) }}***{{ scope.row.orderNo.substring(18) }}
          <base-copy :value="scope.row.orderNo" />
        </template>
      </el-table-column>
      <el-table-column
        prop="margin"
        label="保证金"
        min-width="110"
      >
        <template #default="scope">
          {{ NumberUtil.format(scope.row.margin) * 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="openPrice"
        label="开仓价格"
        min-width="100"
      >
        <template #default="scope">
          {{ NumberUtil.format(scope.row.openPrice) * 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="openTime"
        label="开仓时间"
        min-width="190"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.openTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="止盈/止损"
        min-width="180"
      >
        <template #default="scope">
          {{ scope.row.profitPrice || '--' }}/{{ scope.row.lossPrice || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="closeType"
        label="平仓类型"
        min-width="100"
      >
        <template #default="scope">
          {{ getCloseType(scope.row.closeType) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="closePrice"
        label="平仓价格"
        min-width="100"
      >
        <template #default="scope">
          {{ NumberUtil.format(scope.row.closePrice) * 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="profit"
        label="盈亏"
        min-width="220"
      >
        <template #default="scope">
          <span :class="scope.row.profit >= 0 ? 'bullish' : 'bearish'">
            {{ scope.row.profit >= 0 ? '+' : '' }}{{
              NumberUtil.format(scope.row.profit)
            }}({{ scope.row.profit >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(scope.row.profit / scope.row.margin * 100) }}%)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fee"
        label="手续费"
        min-width="150"
      >
        <template #default="scope">
          -{{ NumberUtil.format(scope.row.fee) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="fundFee"
        label="资金费"
        min-width="150"
      >
        <template #default="scope">
          <span
            v-if="scope.row.fundFee"
            :class="scope.row.fundFee > 0 ? 'bullish' : 'bearish'"
          >
            {{ scope.row.fundFee >= 0 ? '+' : '' }}{{ NumberUtil.format(scope.row.fundFee) }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="closeTime"
        label="平仓时间"
        min-width="190"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.closeTime) }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total > 10"
      style="margin: 10px 0;float:right"
      layout="prev, pager, next"
      @current-change="reload($event)"
      :total="total"
      :current-page="pageNum"
    />
  </div>
</template>

<script>
import BaseCopy from "@/components/base-copy"

export default {
  components: {BaseCopy},
  data() {
    return {
      loading: false,
      orderHeldList: [],
      total: 0,
      pageNum: 1
    }
  },
  methods: {
    getCloseType(closeType) {
      if (closeType === 'USER_CLOSE') {
        return '用户平仓'
      } else if (closeType === 'FORCE_CLOSE') {
        return '系统强平'
      } else if (closeType === 'DELEGATE_CLOSE') {
        return '委托平仓'
      }
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
    reload(pageNum) {
      if (!this.$store.getters.getUserInfo.uid) {
        return
      }
      if (!pageNum) {
        pageNum = 1
      }
      this.pageNum = pageNum
      this.loading = true
      this.axios.get('/v1/order/historyHeld?current=' + pageNum).then(data => {
        this.orderHeldList = data.records
        this.total = data.total
      }).catch(res => {
        this.$error(res.msg)
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>
