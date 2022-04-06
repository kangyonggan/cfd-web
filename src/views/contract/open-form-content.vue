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
        v-if="delegateType === 'PLAN'"
        v-model="params.triggerPrice"
        :precision="priceScale[symbol.replace('/USDT', '').toLowerCase()]"
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
      :type="operType === 'BULLISH' ? 'success' : 'danger'"
      size="medium"
      @click="submit"
      :disabled="loading"
    >
      {{ operType === 'BULLISH' ? '做多' : '做空' }}
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
      delegateType: {
        required: true,
        type: String
      },
      operType: {
        required: true,
        type: String
      },
      marginCoinConfig: {
        required: true,
        type: Object
      },
      symbol: {
        required: true,
        type: String
      },
      leverage: {
        required: true,
        type: String
      },
    },
    data() {
      return {
        loading: false,
        readonlyVal: '最优市价',
        priceScale: PriceScale,
        params: {
          triggerPrice: '',
          margin: '',
          price: 1,
          marginCoin: 'USDT',
          accountType: 'USDT',
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
        if (this.delegateType === 'MARKET') {
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
          let availableMargin = this.marginCoinConfig.available
          if (value > availableMargin) {
            callback(new Error('保证金不足'))
            return
          }
          if (value < this.marginCoinConfig.minMargin) {
            callback(new Error('合约交易保证金太少,不能开仓'))
            return
          }
          callback()
        } else {
          callback(new Error('保证金有误'))
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

          params.delegateType = this.delegateType
          params.operType = this.operType
          params.leverage = this.leverage
          params.quotationCoin = this.symbol.replace('/USDT', '')

          this.axios.post('/v1/contract/order/open', params).then(() => {
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
