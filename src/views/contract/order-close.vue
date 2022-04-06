<template>
  <base-modal
    ref="modal"
    title="平仓"
    url="/v1/contract/order/close"
    :params="params"
    @success="success"
    :width="600"
  >
    <div style="width: 80%;height: 50px;color: var(--app-text-color);font-size: 13px;margin: 0 auto;">
      <div style="width: 50%;float: left">
        <span style="display: inline-block;width: 70px;text-align: right">
          交易对
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{ row.quotationCoin + '/' + row.marginCoin }}</span>
      </div>
      <div style="width: 50%;float: left">
        <span style="display: inline-block;width: 70px;text-align: right">
          持仓方向
        </span>
        <span
          :style="'font-weight: bold;margin-left: 10px;color: ' + (row.operType === 'BULLISH' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
        >{{ row.operType === 'BULLISH' ? '做多' : '做空' }}({{ row.leverage }}x)
        </span>
      </div>
      <div style="width: 50%;float: left;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          开仓价格
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{ row.openPrice }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          最新价格
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{ lastPrice }}
        </span>
      </div>
      <div style="width: 50%;float: left;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          手续费
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{ row.txFee }} USDT
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          预计盈亏
        </span>

        <span
          :style="'font-weight: bold;margin-left: 10px;color: ' + (profit >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
        >
          {{ profit > 0 ? '+' : '' }}{{ profit === '' ? '--' : (profit + '(' + profitRate + ')') }}
        </span>
      </div>
    </div>
    <div style="clear: both" />
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'

  export default {
    emits: ['success'],
    components: {BaseModal},
    data() {
      return {
        params: {
          closePrice: 1,
          orderNo: ''
        },
        profit: '',
        profitRate: '',
        row: {},
        lastPrice: '--',
      }
    },
    methods: {
      show(row) {
        this.row = row
        this.params = {
          closePrice: row.marketPrice,
          orderNo: row.orderNo,
        }
        this.lastPrice = '--'
        this.profit = ''
        this.profitRate = ''
        this.calcProfit()
        this.$refs.modal.show()
      },
      success() {
        this.$success('平仓成功')
        this.$emit('success')
      },
      calcProfit() {
        let lastPrice = this.row.marketPrice
        this.lastPrice = lastPrice
        // 收益率 = 方向 * (收 - 开) / 开 * 杠杆
        let profitRate = (this.row.operType === 'BULLISH' ? 1 : -1) * (lastPrice - this.row.openPrice) / this.row.openPrice * this.row.leverage
        // 收益 = 方向 * (收 - 开) / 开 * 保证金 * 杠杆
        this.profit = this.NumberUtil.formatUsdt(profitRate * this.row.margin)
        this.profitRate = this.NumberUtil.formatUsdt(profitRate * 100) + '%'
      }
    },
    watch: {
      '$store.state.contractPriceMap': function () {
        this.calcProfit()
      }
    }
  }
</script>

