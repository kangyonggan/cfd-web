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
          {{ NumberUtil.format(scope.row.openPrice, quotationMap[scope.row.quotationCoin]) }}
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
import Big from "big.js"
import OrderClose from "./order-close"

export default {
  components: {OrderClose},
  emits: ['updateOrderAmountInfo'],
  data() {
    return {
      loading: false,
      activeTab: localStorage.getItem('orderTab') || '0',
      orderHeldList: [],
      ticketMap: {},
      quotationMap: {},
      totalAmount: 0,
      lastCalcTime: 0
    }
  },
  methods: {
    closeOrder(row) {
      this.$refs['order-close'].show(row)
    },
    calcProfit(row) {
      let lastPrice = this.ticketMap[row.quotationCoin + row.marginCoin]
      if (!lastPrice) {
        return {
          lastPrice: '',
          profit: '',
          addIcon: '',
          profitClass: '',
          profitRate: '',
        }
      }
      lastPrice = lastPrice.close
      // 未实现盈亏 = 方向 * 保证金 * 杠杆 * (最新价-开仓价)/开仓价
      let pos = row.positionSide === 'LONG' ? 1 : -1
      let profit = new Big(pos * row.margin * row.leverage * (lastPrice - row.openPrice)).div(row.openPrice)
      // 回报率 = 方向 * 杠杆 * (最新价-开仓价)/开仓价
      let profitRate = new Big(pos * row.leverage * (lastPrice - row.openPrice)).div(row.openPrice)

      let addIcon = profitRate > 0 ? '+' : ''

      return {
        lastPrice: lastPrice,
        profit: profit,
        addIcon: addIcon,
        profitClass: profitRate > 0 ? 'bullish' : profitRate < 0 ? 'bearish' : '',
        profitRate: addIcon + this.NumberUtil.format(profitRate * 100, 2) + '%',
      }
    },
    updateOrderHeld(orderHeldList) {
      this.refreshOrderHeldList(orderHeldList)
    },
    updateTicket(ticket) {
      this.ticketMap[ticket.symbol] = ticket

      if (this.$store.getters.getUserInfo.uid) {
        if (new Date().getTime() - this.lastCalcTime > 1000) {
          this.refreshOrderHeldList(this.orderHeldList)
        }
      } else {
        this.orderHeldList = []
      }
    },
    updateAccount(account) {
      this.totalAmount = account.assets['CONTRACT']
    },
    updateQuotationList(quotationList) {
      let quotationMap = {}
      for (let i = 0; i < quotationList.length; i++) {
        quotationMap[quotationList[i].quotationCoin] = quotationList[i].quotationPrecision
      }

      this.quotationMap = quotationMap
    },
    refreshOrderHeldList(orderHeldList) {
      this.lastCalcTime = new Date().getTime()
      let totalUnsettleProfit = 0
      let totalMargin = 0
      for (let i = 0; i < orderHeldList.length; i++) {
        let item = orderHeldList[i]
        let res = this.calcProfit(item)
        item.lastPrice = res.lastPrice || undefined
        item.addIcon = res.addIcon
        item.profit = res.profit
        item.profitRate = res.profitRate
        item.profitClass = res.profitClass
        orderHeldList[i] = item

        totalUnsettleProfit += res.profit * 1
        totalMargin += item.margin
      }

      totalUnsettleProfit = this.NumberUtil.formatUsdt(totalUnsettleProfit) * 1
      totalMargin = this.NumberUtil.formatUsdt(totalMargin) * 1
      this.$emit('updateOrderAmountInfo', {unsettleProfit: totalUnsettleProfit, totalMargin: totalMargin})

      let totalAmount = this.totalAmount + totalUnsettleProfit

      // 强平价=开仓价-(账户余额-0.1*保证金)*方向/保证金/杠杆*开仓价（逐仓把账户余额换成保证金）
      // 由于账户余额中加上了未实现盈亏，所以开仓价用最新价替换（逐仓还是用开仓价）
      for (let i = 0; i < orderHeldList.length; i++) {
        let item = orderHeldList[i]
        let pos = new Big(item.positionSide === 'LONG' ? 1 : -1)
        let totalMargin = new Big(item.marginType === 'CROSSED' ? totalAmount : item.margin)
        if (!item.lastPrice) {
          continue
        }
        let openPrice = new Big(item.marginType === 'CROSSED' ? item.lastPrice : item.openPrice)
        let forceClosePrice = openPrice.minus(
          (
            totalMargin.minus(
              new Big(0.1).times(new Big(item.margin))
            ).times(pos)
          ).div(
            new Big(item.margin).times(new Big(item.leverage))
          ).times(
            new Big(openPrice)
          )
        )
        if (forceClosePrice <= 0) {
          forceClosePrice = '永不强平'
          item.forceClosePrice = forceClosePrice
        } else {
          item.forceClosePrice = this.NumberUtil.format(forceClosePrice, this.quotationMap[item.quotationCoin])
        }
        orderHeldList[i] = item
      }

      this.orderHeldList = orderHeldList
    },
    changeSymbol(symbol) {
      this.$router.push({
        to: '/',
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
