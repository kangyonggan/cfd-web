<template>
  <base-modal
    ref="modal"
    title="提币"
    url="/v1/wallet/withdraw"
    :width="700"
    :params="params"
    :rules="rules"
    :auto-submit="false"
    :before-submit="submit"
  >
    <el-form-item
      prop="currency"
      label="币种"
      style="position: relative;"
    >
      <el-select
        v-model="params.currency"
        style="width: 90%"
        @change="changeCurrency"
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
        </el-option>
      </el-select>
      <div style="position: absolute;right: 66px;top: 30px;font-size: 12px;">
        可用余额：{{ protocol.availableAmount * 1 }} {{ params.currency }}
      </div>
    </el-form-item>
    <el-form-item
      prop="protocolType"
      label="协议"
    >
      <el-select
        v-model="params.protocolType"
        style="width: 90%"
        @change="changeProtocol"
      >
        <el-option
          v-for="item in protocols"
          :key="item.protocolType"
          :label="item.protocolType"
          :value="item.protocolType"
        >
          <span style="float: left">
            {{ item.protocolType }}
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="地址"
      prop="address"
    >
      <el-input
        style="width: 90%"
        placeholder="请输入提币地址"
        v-model="params.address"
        clearable
      />
    </el-form-item>
    <el-form-item
      label="金额"
      prop="amount"
      style="position: relative"
    >
      <natural-input
        style="width: 90%"
        v-model="params.amount"
        placeholder="请输入提币金额"
        :precision="8"
      />
      <div style="position: absolute;right: 66px;top: 30px;font-size: 12px;">
        预估到账：{{ params.amount - protocol.withdrawFee > 0 ? params.amount - protocol.withdrawFee : 0 }} {{ params.currency }}
      </div>
    </el-form-item>
    <el-form-item
      prop="payPwd"
      label="支付密码"
    >
      <el-input
        style="width: 90%"
        v-model="params.payPwd"
        type="password"
        show-password
        clearable
        placeholder="请输入支付密码"
      />
    </el-form-item>
    <el-form-item
      prop="googleCode"
      label="谷歌验证码"
      v-if="params.amount >= protocol.safetyVerifyLimit"
    >
      <el-input
        style="width: 90%"
        v-model="params.googleCode"
        show-word-limit
        :maxlength="6"
        clearable
        placeholder="请输入谷歌验证码"
      />
    </el-form-item>

    <el-form-item style="margin-bottom: 0">
      <ol
        style="font-size: 13px;color: var(--app-text-color-dark)"
        class="tips"
      >
        <li>
          只能提取到：<span style="color: var(--el-color-primary)">{{ protocol.netRemark }}</span>
        </li>
        <li>
          提币手续费：{{ protocol.withdrawFee * 1 }} {{ protocol.currency }}
        </li>
        <li>
          最小提币数量：{{ protocol.withdrawMinAmount * 1 }} {{ protocol.currency }}
        </li>
        <li>
          最大提币数量：{{ protocol.withdrawMaxAmount * 1 }} {{ protocol.currency }}
        </li>
        <li>
          每日提币数量：{{ protocol.withdrawDayLimit * 1 }} {{ protocol.currency }}
        </li>
        <li>
          提币到成功我们将以邮件的方式通知您
        </li>
      </ol>
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import NaturalInput from "@/components/natural-input";
  import Md5 from "js-md5";

  export default {
    components: {NaturalInput, BaseModal},
    data() {
      return {
        loading: false,
        params: {
          currency: '',
          protocolType: '',
          address: '',
          payPwd: '',
          googleCode: '',
          amount: '',
        },
        rules: {
          address: [
            {required: true, message: '请输入提币地址'}
          ],
          amount: [
            {required: true, message: '请输入划转金额'},
            {validator: this.validateAmount}
          ],
          payPwd: [
            {required: true, message: '请输入支付密码'}
          ],
          googleCode: [
            {required: true, message: '请输入谷歌验证码'}
          ],
        },
        currencyList: [],
        protocols: [],
        protocol: {}
      }
    },
    methods: {
      resetForm() {
        this.params = {
          currency: '',
            protocolType: '',
            address: '',
            payPwd: '',
            googleCode: '',
            amount: '',
        }
      },
      validateAmount: function (rule, value, callback) {
        if (value === undefined || value === '') {
          callback()
          return
        }
        if (value <= this.protocol.withdrawMinAmount) {
          callback(new Error('金额必须大于' + this.protocol.withdrawMinAmount * 1))
          return;
        }
        if (value > this.protocol.availableAmount) {
          callback(new Error('可用余额不足'))
          return;
        }
        callback()
      },
      changeCurrency() {
        for (let i = 0; i < this.currencyList.length; i++) {
          if (this.currencyList[i].currency === this.params.currency) {
            this.protocols = this.currencyList[i].list
            this.params.protocolType = this.protocols[0].protocolType
            this.changeProtocol()
            break
          }
        }
      },
      changeProtocol() {
        for (let i = 0; i < this.protocols.length; i++) {
          if (this.protocols[i].protocolType === this.params.protocolType) {
            this.protocol = this.protocols[i]
            break
          }
        }
      },
      getWithdraw() {
        this.loading = true
        this.axios.get('/v1/wallet/withdraw').then(data => {
          this.currencyList = data
          this.changeCurrency()
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      show(currency) {
        this.resetForm()
        if (!currency) {
          currency = 'USDT'
        }
        this.params.currency = currency
        this.params.protocolType = ''
        this.getWithdraw()
        this.$refs.modal.show()
      },
      submit() {
        let params = Object.assign({}, this.params)
        params.payPwd = Md5(params.payPwd)
        this.$refs.modal.submit(params)
      },
    },
  }
</script>

<style scoped lang="scss">
.tips {
  padding-left: 22px;

  li {
    line-height: 25px;
  }
}
</style>
