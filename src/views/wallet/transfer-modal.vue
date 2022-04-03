<template>
  <base-modal
    ref="modal"
    title="资金划转"
    url="/v1/wallet/transfer"
    :params="params"
    :rules="rules"
    @success="$emit('success', $event)"
    :width="500"
  >
    <el-form-item
      prop="type"
      label="方向"
    >
      <el-select
        v-model="params.type"
        style="width: 90%"
        @change="changeType"
      >
        <el-option
          value="CAPITAL_CONTRACT"
          label="资金 --> 合约"
        />
        <el-option
          value="CONTRACT_CAPITAL"
          label="合约 --> 资金"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      prop="currency"
      label="币种"
    >
      <el-select
        v-model="params.currency"
        style="width: 90%"
      >
        <el-option
          v-for="item in currencyList"
          :key="item.currency"
          :label="item.currency"
          :value="item.currency"
        >
          <span style="float: left">
            {{ item.currency }}
          </span>
          <span style="float: right;color: var(--app-text-color-dark);font-size: 13px;">
            {{ item.availableAmount }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <div style="text-align: right;padding-right: 38px;">
      可用：{{ amountMap[params.currency] || '--' }}
    </div>
    <el-form-item
      prop="amount"
      label="金额"
    >
      <natural-input
        style="width: 90%"
        v-model="params.amount"
        :precision="8"
        placeholder="请输入划转金额"
        append
      >
        <template #append>
          <span style="cursor: pointer;">
            全部
          </span>
        </template>
      </natural-input>
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import NaturalInput from "../../components/natural-input";

  export default {
    emits: ['success'],
    components: {NaturalInput, BaseModal},
    data() {
      return {
        zj: '资金账户',
        loading: false,
        params: {
          type: '',
          currency: '',
          amount: ''
        },
        rules: {
          amount: [
            {required: true, message: '请输入划转金额'},
            {validator: this.validateAmount}
          ],
        },
        transferCurrencies: [],
        currencyList: [],
        amountMap: {}
      }
    },
    methods: {
      validateAmount: function (rule, value, callback) {
        console.log(value)
        if (value === undefined || value === '') {
          callback()
          return
        }
        if (value === 0) {
          callback(new Error('金额必须大于0'))
          return;
        }
        if (value > this.amountMap[this.params.currency]) {
          callback(new Error('可用余额不足'))
          return;
        }
        callback()
      },
      changeType() {
        let currencyAccountType = this.params.type.replace('CAPITAL', '')
        currencyAccountType = currencyAccountType.replace('_', '')
        this.getCurrencyList(currencyAccountType)

        let amountAccountType = this.params.type.substring(0, this.params.type.indexOf('_'))
        this.getAmountMap(amountAccountType)

        // 如果币种不在新的列表中，把币种切换到第一个
        if (!Object.keys(this.amountMap).includes(this.params.currency)) {
          if (this.currencyList.length) {
            this.params.currency = this.currencyList[0].currency
          } else {
            this.params.currency = ''
          }
        }
      },
      getCurrencyList(accountType) {
        let list = []
        for (let i = 0; i < this.transferCurrencies.length; i++) {
          let item = this.transferCurrencies[i]
          if (item.accountType !== accountType) {
            continue
          }
          list.push(item)
        }
        this.currencyList = list
      },
      getAmountMap(accountType) {
        let map = {}
        for (let i = 0; i < this.transferCurrencies.length; i++) {
          let item = this.transferCurrencies[i]
          if (item.accountType !== accountType) {
            continue
          }
          map[item.currency] = item.availableAmount
        }
        this.amountMap = map
      },
      getTransferCurrencies() {
        this.loading = true
        this.transferCurrencies = []
        this.currencyList = []
        this.amountMap = {}
        this.axios.get('/v1/wallet/transferCurrency').then(data => {
          this.transferCurrencies = data
          this.changeType()
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      show(type, currency) {
        if (!type) {
          type = 'CAPITAL_CONTRACT'
        }
        if (!currency) {
          currency = 'USDT'
        }
        this.params.currency = currency
        this.params.type = type
        this.params.amount = ''

        this.getTransferCurrencies()
        this.$refs.modal.show()
      },
    }
  }
</script>

<style scoped lang="scss">
</style>
