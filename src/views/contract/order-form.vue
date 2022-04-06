<template>
  <div class="order-form">
    <div class="header">
      <span
        :class="{active: delegateType === 'MARKET'}"
        @click="changeDelegateType('MARKET')"
      >
        市价
      </span>
      <span
        :class="{active: delegateType === 'PLAN'}"
        @click="changeDelegateType('PLAN')"
      >
        限价
      </span>
      <div class="actions">
        <span style="cursor: auto;color: var(--app-text-color);padding-right: 20px;">
          可用保证金 {{ marginCoinConfig.available == undefined ? '--' : NumberUtil.formatUsdt(marginCoinConfig.available) + 'USDT' }}
          <el-icon
            style="vertical-align: middle"
            v-if="$store.getters.getUserInfo.uid"
            @click="$refs['fund-transfer'].show('TOHY', 'USDT')"
          >
            <circle-plus style="font-size: 16px;color: var(--el-color-primary)" />
          </el-icon>
        </span>
        <span @click="changeLeverage">
          {{ leverage ? (leverage + 'x') : '--' }}
        </span>
        <span @click="changeMarginType">
          {{ marginType ? (marginType === 'SINGLE' ? '逐仓' : '全仓'): '--' }}
        </span>
      </div>
    </div>

    <open-form
      class="open-form"
      v-if="delegateType === 'MARKET'"
      ref="market-form"
      :symbol="symbol"
      :leverage="leverage"
      :delegate-type="delegateType"
      :margin-coin-config="marginCoinConfig"
      @success="$emit('success')"
    />

    <open-form
      v-else
      class="open-form"
      ref="plan-form"
      :symbol="symbol"
      :leverage="leverage"
      :delegate-type="delegateType"
      :margin-coin-config="marginCoinConfig"
      @success="$emit('success')"
    />

    <switch-leverage
      ref="switch-leverage"
      @success="changeLeverageSuccess"
    />

    <switch-margin-type
      ref="switch-margin-type"
      @success="changeMarginTypeSuccess"
    />

    <fund-transfer
      ref="fund-transfer"
      @success="reload"
    />
  </div>
</template>

<script>
  import OpenForm from './open-form'
  import SwitchLeverage from './switch-leverage'
  import SwitchMarginType from "./switch-margin-type"
  import FundTransfer from '../wallet/transfer-modal.vue'
  import {CirclePlus} from '@element-plus/icons'

  export default {
    components: {SwitchMarginType, OpenForm, SwitchLeverage, FundTransfer, CirclePlus},
    emits: ['success', 'updateMarginCoinConfig'],
    data() {
      return {
        symbol: '',
        delegateType: localStorage.getItem('contractDelegateType') || 'MARKET',
        leverage: '',
        leverageList: [],
        marginCoinConfig: {},
        marginType: ''
      }
    },
    methods: {
      /**
       * 获取保证金信息
       */
      getMarginCoinConfig() {
        let params = 'quotationCoin=' + this.symbol.replace('/USDT', '') + '&accountType=USDT'
        this.axios.get('/v1/contract/order/marginCoinConfig?' + params).then(data => {
          this.marginCoinConfig = data
          this.$emit('updateMarginCoinConfig', data)
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      /**
       * 加载杠杆、可用保证金
       */
      reload() {
        let symbol = this.$route.query.symbol || 'BTC/USDT'
        let userInfo = this.$store.getters.getUserInfo
        if (!userInfo.uid) {
          this.leverage = ''
          this.leverageList = []
          this.marginCoinConfig = {}
          this.marginType = ''
          return
        }

        this.symbol = symbol
        this.leverage = localStorage.getItem('contractLeverage-' + symbol) || ''
        this.marginType = localStorage.getItem('contractMarginType') || ''
        this.getLeverageList(symbol.toUpperCase().replace('/USDT', ''))
        this.getMarginCoinConfig()
        if (!this.marginType) {
          this.getMarginType()
        }
      },
      /**
       * 获取保证金类型
       */
      getMarginType() {
        this.axios.get('/v1/contract/order/mode').then(data => {
          this.marginType = data.mode
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      /**
       * 修改杠杆
       */
      changeLeverage() {
        if (this.leverage) {
          this.$refs['switch-leverage'].show(this.symbol, this.leverage, this.leverageList)
        }
      },
      /**
       * 修改保证金类型
       */
      changeMarginType() {
        if (this.marginType) {
          this.$refs['switch-margin-type'].show(this.marginType)
        }
      },
      /**
       * 修改杠杆成功
       */
      changeLeverageSuccess(leverage) {
        this.leverage = leverage
        localStorage.setItem('contractLeverage-' + this.symbol, this.leverage)
      },
      /**
       * 修改保证金模式成功
       */
      changeMarginTypeSuccess(marginType) {
        this.marginType = marginType
        localStorage.setItem('contractMarginType', this.marginType)
      },
      /**
       * 获取杠杆
       */
      getLeverageList(quotationCoin) {
        let params = 'quotationCoin=' + quotationCoin + '&marginCoin=USDT'
        this.axios.get('/v1/contract/order/leverageList?' + params).then(data => {
          this.leverageList = data.leverageList
          if (!this.leverage) {
            this.changeLeverageSuccess(this.leverageList[0])
          }
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      /**
       * 切换订单类型
       *
       * @param delegateType
       */
      changeDelegateType(delegateType) {
        this.delegateType = delegateType
        localStorage.setItem('contractDelegateType', delegateType)
      },
    },
    activated() {
      // this.reload()
    },
    watch: {
      '$route.query.symbol': function () {
        // this.reload()
      },
    }
  }
</script>

<style scoped lang="scss">
  .order-form {
    clear: both;
    min-height: 220px;

    .header {
      height: 45px;
      background: var(--app-bg-color-light);
      border-bottom: 1px solid var(--app-border-color);

      span {
        display: inline-block;
        min-width: 45px;
        text-align: center;
        height: 43px;
        line-height: 43px;
        padding: 0 5px;
        margin-right: 10px;
        cursor: pointer;
        border-bottom: 2px solid var(--app-bg-color);
      }

      .active {
        color: var(--app-text-color-white);
        border-bottom: 2px solid var(--el-color-primary);
      }

      .actions {
        float: right;

        span {
          display: inline-block;
          height: 43px;
          line-height: 43px;
          cursor: pointer;
          font-size: 13px;
          border-right: 1px solid var(--app-border-color);
          text-align: center;
          min-width: 60px;
          margin-right: 0;
          color: var(--el-color-primary);
        }

        span:last-child {
          border-right: 0;
        }
      }
    }

    .open-form {
    }
  }
</style>
