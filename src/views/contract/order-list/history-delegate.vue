<template>
  <div>
    <el-table
      v-loading="loading"
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
      />
      <el-table-column
        prop="triggerPrice"
        label="触发价格"
        min-width="100"
      >
        <template #default="scope">
          {{ scope.row.triggerDirect === 'GTE' ? '≥' : '≤' }}{{ scope.row.triggerPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="triggerTime"
        label="触发时间"
        min-width="190"
      >
        <template #default="scope">
          <span v-if="scope.row.triggerTime">
            {{ DateTimeUtil.format(scope.row.triggerTime) }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="openPrice"
        label="成交价格"
        min-width="110"
      >
        <template #default="scope">
          <span v-if="scope.row.openPrice">
            {{ scope.row.openPrice }}
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="90"
      >
        <template #default="scope">
          {{ getStatus(scope.row.status) }}
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
      orderDelegateList: [],
      total: 0,
      pageNum: 1
    }
  },
  methods: {
    getStatus(status) {
      if (status === 'FAILURE') {
        return '成交失败'
      } else if (status === 'TRADING') {
        return '已触发'
      } else if (status === 'CANCELED') {
        return '已撤销'
      } else if (status === 'PENDING') {
        return '已触发'
      } else if (status === 'CLOSED') {
        return '已触发'
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
      if (!pageNum) {
        pageNum = 1
      }
      this.pageNum = pageNum
      this.loading = true
      this.axios.get('/v1/order/historyDelegate?current=' + pageNum).then(data => {
        this.orderDelegateList = data.records
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
