<template>
  <base-modal
    ref="modal"
    title="止盈止损"
    url="/v1/contract/order/updateStopPrice"
    :params="params"
    :rules="rules"
    @success="success"
    :width="600"
  >
    <div style="width: 80%;height: 50px;color: var(--app-text-color);font-size: 13px;margin: 0 auto;">
      <div style="width: 50%;float: left">
        <span style="display: inline-block;width: 70px;text-align: right">
          交易对
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-dark)">{{ row.quotationCoin + '/' + row.marginCoin }}</span>
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
      <div style="width: 50%;float: left;margin-top: 5px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          开仓价格
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-dark)">{{ row.openPrice }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 5px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          最新价格
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-dark)">{{ row.marketPrice }}
        </span>
      </div>
    </div>

    <div style="border-bottom: 1px solid var(--app-border-color-light);margin:0 0 20px 0" />

    <el-form-item
      prop="stopProfitPrice"
      label="止盈价格"
      style="width: 500px;margin-bottom: 0 !important"
    >
      <natural-input
        v-model="params.stopProfitPrice"
        :precision="$store.getters.getQuotationMap[row.quotationCoin + row.marginCoin].quotationPrecision"
        placeholder="止盈价格"
        size="small"
        @input="calcProfit"
      />
    </el-form-item>
    <div style="margin-right: 60px;margin-bottom: 20px;float: right;font-size: 13px;">
      <span style="display: inline-block;width: 70px;text-align: right;color: var(--app-text-color-light); ">
        预计盈亏
      </span>

      <span
        :style="'font-weight: bold;margin-left: 10px;color: ' + (profit >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
      >
        {{ profit > 0 ? '+' : '' }}{{ profit === '' ? '--' : (profit + '(' + profitRate + ')') }}
      </span>
    </div>

    <el-form-item
      prop="stopLossPrice"
      label="止损价格"
      style="width: 500px;margin-bottom: 0 !important;clear:both"
    >
      <natural-input
        v-model="params.stopLossPrice"
        :precision="priceScale[row.quotationCoin.toLowerCase()]"
        placeholder="止损价格"
        size="small"
        @input="calcLoss"
      />
    </el-form-item>
    <div style="margin-right: 60px;margin-bottom: 20px;float: right;font-size: 13px;">
      <span style="display: inline-block;width: 70px;text-align: right;color: var(--app-text-color-light); ">
        预计盈亏
      </span>
      <span
        :style="'font-weight: bold;margin-left: 10px;color: ' + (loss >= 0 ? 'var(--el-color-success)' : 'var(--el-color-danger)')"
      >
        {{ loss > 0 ? '+' : '' }}{{ loss === '' ? '--' : (loss + '(' + lossRate + ')') }}
      </span>
    </div>
    <div style="clear: both" />
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import NaturalInput from "../../components/natural-input";

  export default {
    emits: ['success'],
    components: {BaseModal, NaturalInput},
    data() {
      return {
        params: {
          orderNo: '',
          stopProfitPrice: '',
          stopLossPrice: '',
        },
        profit: '',
        profitRate: '',
        loss: '',
        lossRate: '',
        rules: {
          stopProfitPrice: [
            {validator: this.validatePrice}
          ],
          stopLossPrice: [
            {validator: this.validatePrice}
          ]
        },
        row: {},
      }
    },
    methods: {
      validatePrice: function (rule, value, callback) {
        if (!value && value !== 0) {
          callback()
          return
        }
        if (value <= 0) {
          callback(new Error('价格必须大于0'))
        } else {
          callback()
        }
      },
      show(row) {
        this.row = row
        this.params = {
          orderNo: row.orderNo,
          stopProfitPrice: row.stopProfitPrice === '-1' ? '' : row.stopProfitPrice * 1,
          stopLossPrice: row.stopLossPrice === '-1' ? '' : row.stopLossPrice * 1
        }

        this.profit = ''
        this.profitRate = ''
        this.loss = ''
        this.lossRate = ''

        if (this.params.stopProfitPrice) {
          this.calcProfit(this.params.stopProfitPrice)
        }
        if (this.params.stopLossPrice) {
          this.calcLoss(this.params.stopLossPrice)
        }
        this.$refs.modal.show()
      },
      success() {
        this.$success('设置成功')
        this.$emit('success')
      },
      calcProfit(price) {
        if (!price) {
          this.profit = ''
          this.profitRate = ''
          return
        }
        // 收益率 = 方向 * (收 - 开) / 开 * 杠杆
        let profitRate = (this.row.operType === 'BULLISH' ? 1 : -1) * (price * 1 - this.row.openPrice * 1) / this.row.openPrice * this.row.leverage
        // 收益 = 方向 * (收 - 开) / 开 * 保证金 * 杠杆
        this.profit = this.NumberUtil.formatUsdt(profitRate * this.row.margin)
        this.profitRate = this.NumberUtil.formatUsdt(profitRate * 100) + '%'
      },
      calcLoss(price) {
        if (!price) {
          this.loss = ''
          this.lossRate = ''
          return
        }
        // 收益率 = 方向 * (收 - 开) / 开 * 杠杆
        let lossRate = (this.row.operType === 'BULLISH' ? 1 : -1) * (price * 1 - this.row.openPrice * 1) / this.row.openPrice * this.row.leverage
        // 收益 = 方向 * (收 - 开) / 开 * 保证金 * 杠杆
        this.loss = this.NumberUtil.formatUsdt(lossRate * this.row.margin)
        this.lossRate = this.NumberUtil.formatUsdt(lossRate * 100) + '%'
      }
    }
  }
</script>


