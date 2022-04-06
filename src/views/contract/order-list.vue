<template>
  <div class="order-list">
    <div class="header">
      <span
        :class="{active: activeTab === '0'}"
        @click="changeTab('0')"
      >
        持仓中
      </span>
      <span
        :class="{active: activeTab === '1'}"
        @click="changeTab('1')"
      >
        计划委托
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
      :data="orderHelds"
      :cell-style="{padding: '5px 0'}"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
        min-width="100"
      >
        <template #default="scope">
          <span
            style="cursor: pointer;"
            @click="changeSymbol(scope.row.quotationCoin + '/' + scope.row.marginCoin)"
          >
            {{ scope.row.quotationCoin }}/{{ scope.row.marginCoin }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="positionSide"
        label="方向"
        min-width="100"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.operType === 'BULLISH' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
          >
            {{ scope.row.operType === 'BULLISH' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
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
        min-width="90"
      />
      <el-table-column
        prop="marketPrice"
        label="最新价格"
        min-width="90"
      />
      <el-table-column
        prop="txFee"
        label="手续费"
        min-width="110"
      />
      <el-table-column
        prop="fundFee"
        label="资金费"
        min-width="110"
      />
      <el-table-column
        prop="profit"
        label="未实现盈亏"
        min-width="170"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.profitRatio * 1 > 0 ? 'var(--el-color-success)' : scope.row.profitRatio * 1 < 0 ? 'var(--el-color-danger)' : 'rgb(234, 236, 239)')"
          >
            {{ scope.row.profit * 1 >= 0 ? '+' : '' }}{{
              NumberUtil.formatUsdt(scope.row.profit)
            }}({{ scope.row.profitRatio * 1 >= 0 ? '+' : '' }}{{
              NumberUtil.formatUsdt(scope.row.profitRatio) + '%'
            }})
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="止盈/止损"
        min-width="130"
      >
        <template #default="scope">
          {{ scope.row.stopProfitPrice === '-1' ? '--' : scope.row.stopProfitPrice * 1 }}/{{ scope.row.stopLossPrice ===
            '-1' ? '--' : scope.row.stopLossPrice * 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="强平价格"
        min-width="110"
      >
        <template #default="scope">
          {{ scope.row.overstockPrice * 1 > 0 ? scope.row.overstockPrice : '--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="175"
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
            @click="closeOrder(scope.row)"
          >
            平仓
          </span>
          <span
            style="color: var(--el-color-primary);cursor: pointer;margin-left: 5px;"
            @click="showStopLoss(scope.row)"
          >
            止盈止损
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--计划委托-->
    <el-table
      v-loading="loading"
      v-if="activeTab === '1'"
      sytle="width: 100%;clear:both;"
      :data="orderDelegates"
      :row-style="{height: 0}"
      :cell-style="{padding: '5px'}"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
      >
        <template #default="scope">
          <span
            style="cursor: pointer;"
            @click="changeSymbol(scope.row.quotationCoin)"
          >
            {{ scope.row.quotationCoin.toUpperCase() }}{{ scope.row.marginCoin.toUpperCase() }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="positionSide"
        label="方向"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.operType === 'BULLISH' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
          >
            {{ scope.row.operType === 'BULLISH' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="margin"
        label="保证金"
      />
      <el-table-column
        prop="triggerPrice"
        label="触发价"
      />
      <el-table-column
        prop="marketPrice"
        label="最新价格"
      />
      <el-table-column
        prop="stopProfitPrice"
        label="止盈价"
      >
        <template #default="scope">
          {{ scope.row.stopProfitPrice === '-1' ? '--' : scope.row.stopProfitPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stopLossPrice"
        label="止损价"
      >
        <template #default="scope">
          {{ scope.row.stopLossPrice === '-1' ? '--' : scope.row.stopLossPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="180"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
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

    <!--历史持仓-->
    <el-table
      v-if="activeTab === '2'"
      sytle="width: 100%;clear:both;"
      :data="historyOrders"
      :row-style="{height: 0}"
      :cell-style="{padding: '5px'}"
      v-loading="loading"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
      >
        <template #default="scope">
          <span
            style="cursor: pointer;"
            @click="changeSymbol(scope.row.quotationCoin)"
          >
            {{ scope.row.quotationCoin.toUpperCase() }}{{ scope.row.marginCoin.toUpperCase() }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="positionSide"
        label="方向"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.operType === 'BULLISH' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
          >
            {{ scope.row.operType === 'BULLISH' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="profit"
        label="盈亏"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.profit * 1 > 0 ? 'var(--el-color-success)' : scope.row.profit * 1 < 0 ? 'var(--el-color-danger)' : 'rgb(234, 236, 239)')"
          >
            {{ scope.row.profit * 1 >= 0 ? '+' : '' }}{{
              NumberUtil.formatUsdt(scope.row.profit)
            }}({{ scope.row.profit * 1 >= 0 ? '+' : '' }}{{
              NumberUtil.formatUsdt(scope.row.profitRatio) + '%'
            }})
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="openPrice"
        label="开仓价"
      />
      <el-table-column
        prop="closePrice"
        label="平仓价"
      />
      <el-table-column
        prop="openTime"
        label="开仓时间"
        width="180"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.openTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="closeTime"
        label="平仓时间"
        width="180"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.closeTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 10"
      style="margin: 10px 0;float:right"
      v-if="activeTab === '2'"
      layout="prev, pager, next"
      @current-change="loadHistoryOrders($event)"
      :total="total * 1"
      :current-page="pageNum"
    />

    <!--历史委托-->
    <el-table
      v-if="activeTab === '3'"
      sytle="width: 100%;clear:both;"
      :data="historyDelegates"
      :row-style="{height: 0}"
      :cell-style="{padding: '5px'}"
      v-loading="loading"
    >
      <el-table-column
        prop="quotationCoin"
        label="交易对"
      >
        <template #default="scope">
          <span
            style="cursor: pointer;"
            @click="changeSymbol(scope.row.quotationCoin)"
          >
            {{ scope.row.quotationCoin.toUpperCase() }}{{ scope.row.marginCoin.toUpperCase() }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="positionSide"
        label="方向"
      >
        <template #default="scope">
          <span
            :style="'color: ' + (scope.row.operType === 'BULLISH' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
          >
            {{ scope.row.operType === 'BULLISH' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="margin"
        label="保证金"
      >
        <template #default="scope">
          {{ NumberUtil.formatUsdt(scope.row.margin) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="triggerPrice"
        label="触发价"
      />
      <el-table-column
        prop="dealPrice"
        label="成交价"
      >
        <template #default="scope">
          {{ scope.row.dealPrice === '-1' ? '--' : scope.row.dealPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stopProfitPrice"
        label="止盈价"
      >
        <template #default="scope">
          {{ scope.row.stopProfitPrice === '-1' ? '--' : scope.row.stopProfitPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="stopLossPrice"
        label="止损价"
      >
        <template #default="scope">
          {{ scope.row.stopLossPrice === '-1' ? '--' : scope.row.stopLossPrice }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template #default="scope">
          {{ getDelegateStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="委托时间"
        width="180"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="触发时间"
        width="180"
      >
        <template #default="scope">
          {{ DateTimeUtil.format(scope.row.updateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="activeTab === '3'"
      v-show="delegateTotal > 10"
      style="margin: 10px 0;float:right"
      layout="prev, pager, next"
      @current-change="loadHistoryDelegates($event)"
      :total="delegateTotal * 1"
      :current-page="delegatePageNum"
    />

    <!--止盈止损-->
    <stop-profit-loss
      ref="stop-profit-loss"
      @success="reload"
    />

    <!--平仓-->
    <order-close
      ref="order-close"
      @success="closeSuccess"
    />
  </div>
</template>

<script>
  import StopProfitLoss from './stop-profit-loss'
  import OrderClose from "./order-close"
  import Env from '@/util/env'

  export default {
    components: {OrderClose, StopProfitLoss},
    emits: ['success'],
    data() {
      return {
        loading: false,
        activeTab: localStorage.getItem('orderTab') || '0',
        orderHelds: [],
        orderDelegates: [],
        historyOrders: [],
        historyDelegates: [],
        pageNum: 1,
        total: 0,
        delegatePageNum: 1,
        delegateTotal: 0,
        retryCount: 0
      }
    },
    methods: {
      changeSymbol(quotationCoin) {
        this.$router.push({
          to: '/',
          query: {
            symbol: quotationCoin,
            interval: this.$route.query.interval
          }
        })
        scrollTo(0, 0)
      },
      getDelegateStatus(status) {
        if (status === 'SUCCESS') {
          return '已成交'
        } else if (status === 'CANCEL') {
          return '已撤销'
        } else if (status === 'FAILED') {
          return '委托失败'
        }

        return status
      },
      showStopLoss(row) {
        this.$refs['stop-profit-loss'].show(row)
      },
      closeOrder(row) {
        this.$refs['order-close'].show(row)
      },
      closeSuccess() {
        this.reload()
        this.$emit('success')
      },
      loadHeldOrders() {
        if (!this.$store.getters.getUserInfo.uid) {
          this.orderHelds = []
          return
        }
        this.loading = true
        this.axios.get('/v1/contract/order/heldList?type=USDT').then(data => {
          this.orderHelds = data
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      loadDelegateOrders() {
        if (!this.$store.getters.getUserInfo.uid) {
          this.orderDelegates = []
          return
        }
        this.loading = true
        this.axios.get('/v1//contract/order/delegateList?type=USDT').then(data => {
          this.orderDelegates = data
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      loadHistoryOrders(pageNum) {
        if (!this.$store.getters.getUserInfo.uid) {
          this.historyOrders = []
          this.total = 0
          return
        }
        if (!pageNum) {
          pageNum = 1
        }
        this.pageNum = pageNum
        this.loading = true
        this.axios.get('/v1/contract/order/historyList?type=USDT&currentPage=' + pageNum).then(data => {
          this.historyOrders = data.list
          this.total = data.total
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      loadHistoryDelegates(pageNum) {
        if (!this.$store.getters.getUserInfo.uid) {
          this.historyDelegates = []
          this.delegateTotal = 0
          return
        }
        if (!pageNum) {
          pageNum = 1
        }
        this.delegatePageNum = pageNum
        this.loading = true
        this.axios.get('/v1/contract/order/delegateHistoryList?type=USDT&currentPage=' + pageNum).then(data => {
          this.historyDelegates = data.list
          this.delegateTotal = data.total
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      cancelOrder(row) {
        this.axios.post('/v1/contract/order/revoke', {orderNo: row.orderNo}).then(() => {
          this.$success('撤销成功')
          this.reload()
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      changeTab(activeTab) {
        localStorage.setItem('orderTab', activeTab)
        this.activeTab = activeTab
        if (activeTab === '0') {
          this.loadHeldOrders()
        } else if (activeTab === '1') {
          this.loadDelegateOrders()
        } else if (activeTab === '2') {
          this.loadHistoryOrders()
        } else {
          this.loadHistoryDelegates()
        }
      },
      reload() {
        this.changeTab(this.activeTab)
      },
      /**
       * 更新持仓订单
       */
      updateHeldOrder(data) {
        for (let i = 0; i < this.orderHelds.length; i++) {
          if (data.orderNo === this.orderHelds[i].orderNo) {
            this.orderHelds[i] = data
            break
          }
        }
      },
      /**
       * 更新持仓委托订单
       */
      updateHeldDelegateOrder(data) {
        for (let i = 0; i < this.orderDelegates.length; i++) {
          if (data.orderNo === this.orderDelegates[i].orderNo) {
            this.orderDelegates[i] = data
            break
          }
        }
      },
      /**
       * ws推送
       */
      initWs() {
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        if (userInfo && userInfo.token) {
          if (this.ws) {
            return
          }
          let params = 'appId=' + encodeURIComponent(userInfo.appId) + '&token=' + encodeURIComponent(userInfo.token) + '&loginType=PC&sign=' + encodeURIComponent(userInfo.sign)
          this.ws = new WebSocket(Env.contractWsUrl + '/ws/contract?' + params)

          let that = this;
          this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data)
            if (data.topic === 'contract_held_order') {
              that.updateHeldOrder(data.data)
            } else if (data.topic === 'contract_held_delegate_order') {
              that.updateHeldDelegateOrder(data.data)
            }
          }

          this.ws.onclose = function () {
            if (that.ws) {
              that.ws.close()
            }
            that.ws = undefined
            that.retryCount %= 10
            that.retryCount++
            let timeout = that.retryCount * 2000
            setTimeout(function () {
              that.initWs()
            }, timeout)
          }
        } else {
          if (this.ws) {
            this.ws.close()
          }
          this.ws = undefined
        }
      },
    },
    activated() {
      // this.reload()
      // this.initWs()
    },
  }
</script>

<style scoped lang="scss">
  .bullish {
    color: var(--el-color-success);
  }

  .bearish {
    color: var(--el-color-danger);
  }

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
