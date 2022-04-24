<template>
  <base-modal
    ref="modal"
    title="充值"
    :auto-submit="false"
    :submit-disabled="true"
    :width="600"
  >
    <el-form-item
      prop="currency"
      label="币种"
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
    >
      <el-input
        style="width: 90%"
        readonly
        v-model="protocol.address"
      >
        <template #append>
          <div>
            <base-copy
              v-if="protocol.address"
              :value="protocol.address"
            />
            <el-icon
              v-else
              style="cursor: not-allowed;margin-left: 5px;"
            >
              <document-copy />
            </el-icon>
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <div
        v-show="protocol.address"
        id="qrcode"
        style="width: 150px;height: 150px; float: left;border: 1px solid var(--app-border-color);"
      />
      <div
        v-show="!protocol.address"
        style="width: 150px;height: 150px; float: left;border: 1px solid var(--app-border-color);text-align: center;"
      >
        <span
          @click="bindAddress"
          style="margin-top: 50px;color: var(--el-color-primary);display: inline-block;cursor: pointer"
        >
          创建地址
        </span>
      </div>
      <ol style="float: left;font-size: 13px;color: var(--app-text-color-dark)">
        <li>
          此地址只可接收{{ protocol.currency }}({{ protocol.netRemark }})
        </li>
        <li>
          最小充值数量：{{ protocol.rechargeMinAmount }} {{ protocol.currency }}
        </li>
        <li>
          充值到账后我们将以邮件的方式通知您
        </li>
      </ol>
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import {qrcanvas} from "qrcanvas"
  import {DocumentCopy} from '@element-plus/icons'
  import BaseCopy from '@/components/base-copy'

  export default {
    components: {BaseCopy, DocumentCopy, BaseModal},
    data() {
      return {
        loading: false,
        params: {
          currency: '',
          protocolType: ''
        },
        currencyList: [],
        protocols: [],
        protocol: {}
      }
    },
    methods: {
      bindAddress() {
        if (this.loading) {
          return
        }
        this.loading = true
        this.axios.post('/v1/wallet/address', this.params).then(() => {
          this.getRecharge()
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
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
            if (this.protocol.address) {
              this.generateQrCode(this.protocol.address)
            }
            break
          }
        }
      },
      getRecharge() {
        this.loading = true
        this.axios.get('/v1/wallet/recharge').then(data => {
          this.currencyList = data
          this.changeCurrency()
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      show(currency) {
        if (!currency) {
          currency = 'USDT'
        }
        this.params.currency = currency
        this.params.protocolType = ''
        this.getRecharge()
        this.$refs.modal.show()
      },
      generateQrCode(text) {
        let qr = qrcanvas({
          data: text,
          size: 150,
          padding: 5
        })
        document.getElementById('qrcode').innerHTML = ''
        document.getElementById('qrcode').appendChild(qr)
      },
    },
  }
</script>
