<template>
  <el-form
    class="form"
    ref="form"
    label-position="right"
    :model="params"
    :rules="rules"
  >
    <el-form-item
      prop="triggerPrice"
      label="触发价"
    >
      <natural-input
        v-if="type === 'LIMIT'"
        v-model="params.triggerPrice"
        :precision="$store.getters.getQuotationMap[symbol] ? $store.getters.getQuotationMap[symbol].quotationPrecision : 8"
        placeholder="请输入触发价"
        size="small"
      />
      <el-input
        v-else
        size="small"
        v-model="readonlyVal"
        readonly
      />
    </el-form-item>

    <el-form-item
      label="本金"
      prop="margin"
      style="margin-bottom: 13px;"
    >
      <natural-input
        v-model="params.margin"
        :precision="2"
        placeholder="请输入下单本金"
        size="small"
        append
      >
        <template #append>
          USDT
        </template>
      </natural-input>
    </el-form-item>

    <div class="stop-price">
      <div style="float: left">
        <span style="display: inline-block;width: 76px;text-align: right">止盈止损</span>
        <el-checkbox
          v-model="showStop"
          @change="changeShowStop"
        />
      </div>
      <el-form-item
        prop="profitPrice"
        style="float: left"
      >
        <natural-input
          v-if="showStop"
          v-model="params.profitPrice"
          size="mini"
          :precision="$store.getters.getQuotationMap[symbol] ? $store.getters.getQuotationMap[symbol].quotationPrecision : 8"
          placeholder="止盈价"
        />
      </el-form-item>
      <el-form-item
        prop="lossPrice"
        style="float: left"
      >
        <natural-input
          v-if="showStop"
          v-model="params.lossPrice"
          :precision="$store.getters.getQuotationMap[symbol] ? $store.getters.getQuotationMap[symbol].quotationPrecision : 8"
          size="mini"
          placeholder="止损价"
        />
      </el-form-item>
    </div>

    <el-button
      style="width: 100%;margin-top: 12px;"
      :type="positionSide === 'LONG' ? 'success' : 'danger'"
      size="medium"
      @click="submit"
      :disabled="loading"
    >
      {{ positionSide === 'LONG' ? '做多' : '做空' }}
    </el-button>
  </el-form>
</template>

<script>
  import NaturalInput from "@/components/natural-input";

  export default {
    components: {NaturalInput},
    props: {
      type: {
        required: true,
        type: String
      },
      positionSide: {
        required: true,
        type: String
      },
    },
    data() {
      return {
        loading: false,
        symbol: '',
        readonlyVal: '最优市价',
        availableAmount: 0,
        lastPrice: '',
        showStop: localStorage.getItem('showStop-' + this.positionSide) === '1',
        params: {
          triggerPrice: '',
          margin: '',
          marginCoin: 'USDT',
          profitPrice: '',
          lossPrice: ''
        },
        rules: {
          triggerPrice: [
            {validator: this.validatePrice}
          ],
          margin: [
            {validator: this.validateMargin}
          ],
          profitPrice: [
            {validator: this.validateProfitPrice}
          ],
          lossPrice: [
            {validator: this.validateLossPrice}
          ],
        },
      }
    },
    methods: {
      validateProfitPrice: function (rule, value, callback) {
        if (!this.showStop) {
          callback()
          return
        }
        if (!value && value !== 0) {
          callback()
          return
        }
        if (isNaN(value) || value * 1 <= 0) {
          callback(new Error('触发价格有误'))
          return;
        }
        // 做多止盈不能低于最新价/触发价
        if (this.positionSide === 'LONG') {
          if (this.type === 'LIMIT') {
            if (!this.params.triggerPrice) {
              callback(new Error('请先输入触发价'))
              return;
            } else if (value * 1 < this.params.triggerPrice * 1) {
              callback(new Error('止盈价不得低于触发价'))
              return;
            }
          } else if (value * 1 < this.lastPrice * 1) {
            callback(new Error('止盈价不得低于最新价'))
            return;
          }
        } else {
          // 做空止盈不能高于最新价/触发价
          if (this.type === 'LIMIT') {
            if (!this.params.triggerPrice) {
              callback(new Error('请先输入触发价'))
              return;
            } else if (value * 1 > this.params.triggerPrice * 1) {
              callback(new Error('止盈价不得高于触发价'))
              return;
            }
          } else if (value * 1 > this.lastPrice * 1) {
            callback(new Error('止盈价不得高于最新价'))
            return;
          }
        }

        callback()
      },
      validateLossPrice: function (rule, value, callback) {
        if (!this.showStop) {
          callback()
          return
        }
        if (!value && value !== 0) {
          callback()
          return
        }
        if (isNaN(value) || value * 1 <= 0) {
          callback(new Error('触发价格有误'))
          return;
        }
        // 做多止损不能高于最新价/触发价
        if (this.positionSide === 'LONG') {
          if (this.type === 'LIMIT') {
            if (!this.params.triggerPrice) {
              callback(new Error('请先输入触发价'))
              return;
            } else if (value * 1 > this.params.triggerPrice * 1) {
              callback(new Error('止损价不得高于触发价'))
              return;
            }
          } else if (value * 1 > this.lastPrice * 1) {
            callback(new Error('止损价不得高于最新价'))
            return;
          }
        } else {
          // 做空止损不能低于最新价/触发价
          if (this.type === 'LIMIT') {
            if (!this.params.triggerPrice) {
              callback(new Error('请先输入触发价'))
              return;
            } else if (value * 1 < this.params.triggerPrice * 1) {
              callback(new Error('止损价不得低于触发价'))
              return;
            }
          } else if (value * 1 < this.lastPrice * 1) {
            callback(new Error('止损价不得低于最新价'))
            return;
          }
        }

        callback()
      },
      changeShowStop() {
        localStorage.setItem('showStop-' + this.positionSide, this.showStop ? '1' : '0')
      },
      validatePrice: function (rule, value, callback) {
        if (this.type === 'MARKET') {
          callback()
          return
        }
        if (!value && value !== 0) {
          callback(new Error('请输入触发价格'))
          return
        }
        if (!isNaN(value) && value * 1 > 0) {
          callback()
        } else {
          callback(new Error('请输入触发价'))
        }
      },
      validateMargin: function (rule, value, callback) {
        if (!isNaN(value) && value * 1 > 0) {
          if (value > this.availableAmount) {
            callback(new Error('可用保证金不足'))
            return
          }

          let quotationConfig = this.$store.getters.getQuotationMap[this.symbol]
          if (value < quotationConfig.minMargin) {
            callback(new Error('最小开仓保证金为 ' + quotationConfig.minMargin + ' USDT'))
            return
          }
          if (quotationConfig.maxMargin > 0 && value > quotationConfig.maxMargin) {
            callback(new Error('最大开仓保证金为 ' + quotationConfig.maxMargin + ' USDT'))
            return
          }
          callback()
        } else {
          callback(new Error('请输入保证金'))
        }
      },
      submit() {
        if (!this.$store.getters.getUserInfo.uid) {
          this.$router.push({
            path: '/login',
          })
          return
        }
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return
          }
          this.loading = true
          let params = Object.assign({}, this.params)

          params.type = this.type
          params.positionSide = this.positionSide
          params.leverage = localStorage.getItem('leverage-' + this.symbol) || '20'
          params.quotationCoin = this.symbol.replace('USDT', '')

          this.axios.post('/v1/order/open', params).then(() => {
            this.$success('下单成功')
            this.params.triggerPrice = ''
            this.params.profitPrice = ''
            this.params.lossPrice = ''
            this.params.margin = ''
          }).catch(res => {
            this.$error(res.msg)
          }).finally(() => {
            this.loading = false
            this.$refs['form'].clearValidate()
          })
        })
      },
      updateAvailableAmount(availableAmount) {
        this.availableAmount = availableAmount
      },
    },
    mounted() {
      this.symbol = this.$route.query.symbol || 'BTCUSDT'

      // 监听最新K线
      this.$eventBus.on('updateTicket', data => {
        if (data.symbol === this.symbol) {
          this.lastPrice = data.close
        }
      })
    },
    watch: {
      '$route'(newRoute) {
        let symbol = newRoute.query.symbol || 'BTCUSDT'
        if (this.symbol !== symbol) {
          this.params.triggerPrice = ''
        }
        this.symbol = symbol
      }
    }
  }
</script>

<style scoped lang="scss">
  .form {
    height: 185px;

    ::v-deep(.el-form-item) {
      margin-bottom: 18px;
    }

    ::v-deep(.el-form-item__label) {
      width: 90px;
      height: 32px;
      line-height: 32px;
      text-align: right;
    }

    ::v-deep(.el-form-item__content) {
      display: inline-block;
      line-height: 32px;
      width: calc(100% - 70px);
    }

    ::v-deep(.el-form-item__error) {
      padding-top: 1px;
    }

    .stop-price {
      float: left;
      width: 100%;

      .el-checkbox {
        margin-left: 12px;
      }

      .el-form-item {
        width: calc(50% - 62px);
        margin-bottom: 0;
        margin-left: 10px;
        margin-top: 3px;
      }
    }
  }
</style>
