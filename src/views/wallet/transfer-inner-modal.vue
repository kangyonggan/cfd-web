<template>
  <base-modal
    ref="modal"
    title="转账"
    url="/v1/wallet/transferInner"
    :params="params"
    :rules="rules"
    :width="500"
  >
    <el-form-item
      prop="toUid"
      label="收款人UID"
      style="position: relative"
    >
      <el-input
        style="width: 90%"
        placeholder="请输入收款人UID"
        clearable
        show-word-limit
        :maxlength="8"
        v-model="params.toUid"
      />
      <span
        v-if="email"
        style="position: absolute;right: 35px;top: 27px;font-size: 12px;color: var(--el-color-primary)"
      >
        {{ email }}
      </span>
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
            {{ item.totalAmount - item.frozenAmount }}
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
        placeholder="请输入转账金额"
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

  export default {
    components: {NaturalInput, BaseModal},
    data() {
      return {
        loading: false,
        params: {
          toUid: '',
          currency: '',
          amount: ''
        },
        rules: {
          toUid: [
            {required: true, message: '请输入收款人UID'},
            {validator: this.validateUid}
          ],
          amount: [
            {required: true, message: '请输入划转金额'},
            {validator: this.validateAmount}
          ],
        },
        currencyList: [],
        amountMap: {},
        email: ''
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
      validateUid: function (rule, value, callback) {
        if (value === undefined || value === '') {
          this.email = ''
          callback()
          return
        }
        if (value.length < 8) {
          this.email = ''
          callback(new Error('UID至少是8位'))
          return
        }
        if (value === this.$store.getters.getUserInfo.uid) {
          this.email = ''
          callback(new Error('不能给自己转账'))
          return
        }

        this.axios.get('/v1/user/check?uid=' + value).then(data => {
          this.email = data
          callback()
        }).catch(() => {
          this.email = ''
          callback(new Error('用户不存在'))
        })
      },
      getAccountDetail() {
        this.currencyList = []
        this.axios.get('/v1/wallet/accountDetail?accountType=CAPITAL').then(data => {
          this.currencyList = data.list
          let map = {}
          for (let i = 0; i < this.currencyList.length; i++) {
            let item = this.currencyList[i]
            map[item.currency] = item.totalAmount - item.frozenAmount
          }
          this.amountMap = map
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      show() {
        this.params.currency = 'USDT'
        this.params.amount = ''
        this.params.toUid = ''
        this.email = ''
        this.getAccountDetail()

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
