<template>
  <base-modal
    ref="modal"
    title="市价平仓"
    url="/v1/order/close"
    :params="params"
    @success="success"
    :width="600"
  >
    <div style="width: 80%;height: 50px;color: var(--app-text-color);font-size: 13px;margin: 0 auto;">
      <div style="width: 50%;float: left">
        <span style="display: inline-block;width: 70px;text-align: right">
          交易对
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{
          row.quotationCoin + '/' + row.marginCoin
        }}</span>
      </div>
      <div style="width: 50%;float: left">
        <span style="display: inline-block;width: 70px;text-align: right">
          持仓方向
        </span>
        <span
          :style="'font-weight: bold;margin-left: 10px;color: ' + (row.positionSide === 'LONG' ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
        >{{ row.positionSide === 'LONG' ? '做多' : '做空' }}({{ row.leverage }}x)
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
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-light)">{{ row.lastPrice }}
        </span>
      </div>
      <div style="width: 50%;float: left;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          手续费
        </span>

        <span style="font-weight: bold;margin-left: 10px;">
          {{ calcFee() }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          预计盈亏
        </span>
        <span
          style="font-weight: bold;margin-left: 10px;"
          :class="row.profitClass"
        >
          {{ row.profit * 1 >= 0 ? '+' : '' }}{{
            NumberUtil.formatUsdt(row.profit)
          }}({{ row.profitRate }})
        </span>
      </div>
    </div>
    <div style="clear: both" />
  </base-modal>
</template>

<script>
import BaseModal from '@/components/base-modal.vue'
import Big from "big.js"

export default {
  emits: ['success'],
  components: {BaseModal},
  data() {
    return {
      params: {
        orderNo: ''
      },
      row: {},
    }
  },
  methods: {
    show(row) {
      this.row = row
      this.params = {
        orderNo: row.orderNo,
      }
      this.$refs.modal.show()
    },
    calcFee() {
      return new Big(this.row.margin).times(new Big(this.row.leverage)).times(new Big(this.$store.getters.getQuotationMap[this.row.quotationCoin + this.row.marginCoin].closeFeeRate))
    },
    success() {
      this.$success('平仓成功')
      this.$emit('success')
    }
  }
}
</script>

