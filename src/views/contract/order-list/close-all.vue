<template>
  <base-modal
    ref="modal"
    title="一键平仓"
    url="/v1/order/closeAll"
    :params="{}"
    @success="success"
    :width="600"
  >
    <div style="width: 80%;height: 50px;color: var(--app-text-color);font-size: 13px;margin: 0 auto;">
      <div style="width: 50%;float: left;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          订单数量
        </span>

        <span style="font-weight: bold;margin-left: 10px;">
          {{ orderNum }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          占用保证金
        </span>
        <span style="font-weight: bold;margin-left: 10px;">
          {{ margin }}
        </span>
      </div>
      <div style="width: 50%;float: left;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          手续费
        </span>

        <span style="font-weight: bold;margin-left: 10px;">
          {{ fee }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          预计总盈亏
        </span>
        <span
          style="font-weight: bold;margin-left: 10px;"
          :class="profit >= 0 ? 'bullish' : 'bearish'"
        >
          {{ profit * 1 >= 0 ? '+' : '' }}{{ profit }}
        </span>
      </div>
    </div>
    <div style="clear: both" />
  </base-modal>
</template>

<script>
import BaseModal from '@/components/base-modal.vue'

export default {
  components: {BaseModal},
  data() {
    return {
      fee: '',
      profit: '',
      orderNum: '',
      margin: '',
    }
  },
  methods: {
    show(rows) {
      let fee = 0
      let profit = 0
      let orderNum = 0
      let margin = 0
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i]
        margin += row.margin
        profit += row.profit * 1
        fee += row.fee
        orderNum++
      }
      this.fee = fee
      this.profit = this.NumberUtil.formatUsdt(profit);
      this.orderNum = orderNum
      this.margin = margin

      this.$refs.modal.show()
    },
    success() {
      this.$success('平仓成功')
    },
    updateOrderAmountInfo(orderAmountInfo) {
      this.profit = orderAmountInfo.unsettleProfit
    }
  },
  mounted() {
    this.$eventBus.on('updateOrderAmountInfo', this.updateOrderAmountInfo)
  }
}
</script>

