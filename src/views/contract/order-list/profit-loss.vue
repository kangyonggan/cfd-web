<template>
  <base-modal
    ref="modal"
    :title="title"
    url="/v1/order/profitLoss"
    :params="params"
    :rules="rules"
    @success="success"
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
          方向
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
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-dark)">{{ row.openPrice }}
        </span>
      </div>
      <div style="width: 50%;float: right;margin-top: 20px;">
        <span style="display: inline-block;width: 70px;text-align: right">
          最新价格
        </span>
        <span style="font-weight: bold;margin-left: 10px;color: var(--app-text-color-dark)">{{ row.lastPrice }}
        </span>
      </div>
    </div>

    <div style="border-bottom: 1px solid var(--app-border-color-light);width: 82%;margin: 30px auto 25px auto" />

    <el-form-item
      prop="price"
      :label="label"
      style="width: 85%;margin: 20px 0 0 30px;"
    >
      <natural-input
        v-model="params.price"
        :precision="$store.getters.getQuotationMap[row.quotationCoin + row.marginCoin].quotationPrecision"
        :placeholder="'请输入' + label"
        size="small"
        @input="calcProfit"
      />
    </el-form-item>
    <div style="float: left;font-size: 13px;margin-top: 20px;margin-left: 43px;">
      <span style="display: inline-block;width: 70px;text-align: right;color: var(--app-text-color-light); ">
        预计盈亏
      </span>

      <span
        :style="'font-weight: bold;margin-left: 13px;color: ' + (profit > 0 ? 'var(--el-color-success)' : profit < 0 ? 'var(--el-color-danger)' : '')"
      >
        {{ profit > 0 ? '+' : '' }}{{ profit === '' ? '--' : (profit + '(' + profitRate + ')') }}
      </span>
    </div>

    <div style="clear: both" />
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import NaturalInput from "@/components/natural-input";

  export default {
    emits: ['success'],
    components: {BaseModal, NaturalInput},
    data() {
      return {
        row: {},
        title: '',
        label: '',
        params: {
          orderNo: '',
          type: '',
          price: '',
        },
        profit: '',
        profitRate: '',
        rules: {
          price: [
            {validator: this.validatePrice}
          ],
        },
      }
    },
    methods: {
      validatePrice: function (rule, value, callback) {
        if (!value && value !== 0) {
          callback()
          return
        }
        if (value <= 0) {
          callback(new Error(this.label + '必须大于0'))
        } else if (this.params.type === 'profitPrice') {
          if (this.row.positionSide === 'LONG' && value < this.row.lastPrice) {
            callback(new Error('做多' + this.label + '不能小于最新价'))
          } else if (this.row.positionSide === 'SHORT' && value > this.row.lastPrice) {
            callback(new Error('做多' + this.label + '不能大于最新价'))
          }
        } else if (this.params.type === 'lossPrice') {
          if (this.row.positionSide === 'LONG' && value > this.row.lastPrice) {
            callback(new Error('做多' + this.label + '不能大于最新价'))
          } else if (this.row.positionSide === 'SHORT' && value < this.row.lastPrice) {
            callback(new Error('做多' + this.label + '不能小于最新价'))
          }
        } else {
          callback()
        }
      },
      show(row, type) {
        this.row = row
        this.params = {
          orderNo: row.orderNo,
          price: row[type],
          type: type
        }
        this.profit = ''
        this.profitRate = ''
        this.title = type === 'profitPrice' ? '设置止盈' : '设置止损'
        this.label = type === 'profitPrice' ? '止盈价格' : '止损价格'

        this.calcProfit(row[type])
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
        let profitRate = (this.row.positionSide === 'LONG' ? 1 : -1) * (price * 1 - this.row.openPrice * 1) / this.row.openPrice * this.row.leverage
        // 收益 = 方向 * (收 - 开) / 开 * 保证金 * 杠杆
        this.profit = this.NumberUtil.formatUsdt(profitRate * this.row.margin)
        this.profitRate = this.NumberUtil.formatUsdt(profitRate * 100) + '%'
      }
    }
  }
</script>


