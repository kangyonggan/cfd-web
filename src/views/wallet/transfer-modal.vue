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
    <el-form-item prop="type">
      <div class="transfer">
        <span>
          {{ this.params.type === 'CAPITAL_CONTRACT' ? '资金账户' : '合约账户' }}
        </span>
        <span style="text-align: center;">
          <el-icon>
            <Switch
              @click="changeType"
              style="font-size: 30px;color: var(--el-color-primary);padding-top: 2px;cursor: pointer;"
            />
          </el-icon>
        </span>
        <span style="text-align: right">
          {{ this.params.type === 'CAPITAL_CONTRACT' ? '合约账户' : '资金账户' }}
        </span>
      </div>
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
    <div style="padding-left: 95px;">
      可用：{{ amountMap[params.currency] }}
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
          <span
            class="select-all"
            @click="params.amount = amountMap[params.currency]"
          >
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
  import {Switch} from '@element-plus/icons'

  export default {
    emits: ['success'],
    components: {NaturalInput, BaseModal, Switch},
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
        this.params.amount = ''
        if (this.params.type === 'CAPITAL_CONTRACT') {
          this.params.type = 'CONTRACT_CAPITAL'
        } else if (this.params.type === 'CONTRACT_CAPITAL') {
          this.params.type = 'CAPITAL_CONTRACT'
        }
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
      getTransfer() {
        this.loading = true
        this.transferCurrencies = []
        this.currencyList = []
        this.amountMap = {}
        this.axios.get('/v1/wallet/transfer').then(data => {
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

        this.getTransfer()
        this.$refs.modal.show()
      },
    }
  }
</script>

<style scoped lang="scss">
  .select-all {
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    user-select: none;
  }
  .transfer {
    width: 90%;

    span {
      display: inline-block;
      width: 33.33%;
      color: var(--app-text-color-light);
      float: left;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      user-select: none;
    }
  }
</style>