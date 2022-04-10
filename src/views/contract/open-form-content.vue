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
        :precision="priceScale[symbol.replace('USDT', '').toLowerCase()]"
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

    <el-button
      style="width: 100%;margin-top: 5px;"
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
  import NaturalInput from "../../components/natural-input";
  import PriceScale from './price-scale'

  export default {
    emits: ['success'],
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
        priceScale: PriceScale,
        availableAmount: 0,
        params: {
          triggerPrice: '',
          margin: '',
          marginCoin: 'USDT'
        },
        rules: {
          triggerPrice: [
            {validator: this.validatePrice}
          ],
          margin: [
            {validator: this.validateMargin}
          ]
        },
      }
    },
    methods: {
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
          callback(new Error('触发价格有误'))
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
          callback(new Error('保证金有误'))
        }
      },
      updateAvailableAmount(availableAmount) {
        this.availableAmount = availableAmount
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
            this.params.margin = ''
            this.$emit('success')
          }).catch(res => {
            this.$error(res.msg)
          }).finally(() => {
            this.loading = false
            this.$refs['form'].clearValidate()
          })
        })
      },
    },
    mounted() {
      this.symbol = this.$route.query.symbol || 'BTCUSDT'
    },
    watch: {
      '$route'(newRoute) {
        this.symbol = newRoute.query.symbol || 'BTCUSDT'
      }
    }
  }
</script>

<style scoped lang="scss">
  .form {
    height: 147px;

    ::v-deep(.el-input-group__append) {
      width: 58px;
      text-align: center;
    }

    ::v-deep(.el-form-item__label) {
      width: 70px;
      height: 32px;
      line-height: 32px;
      text-align: right;
      color: #a6afc6;
    }

    ::v-deep(.el-form-item) {
      margin-bottom: 20px !important;
    }

    ::v-deep(.el-form-item__content) {
      display: inline-block;
      line-height: 32px;
      width: calc(100% - 70px);
    }

    .stop-price {
      float: left;
      width: calc(50% - 59px);
      margin-left: 15px;
      margin-bottom: 0 !important;
    }

    ::v-deep(.stop-price .el-form-item__content) {
      width: 100%;
    }

  }
</style>
