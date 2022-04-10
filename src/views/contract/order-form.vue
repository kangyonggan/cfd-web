<template>
  <div class="order-form">
    <div class="header">
      <span
        :class="{active: type === 'MARKET', tab: true}"
        @click="changeType('MARKET')"
      >
        市价
      </span>
      <span
        :class="{active: type === 'LIMIT', tab: true}"
        @click="changeType('LIMIT')"
      >
        限价
      </span>
      <div class="actions">
        <div class="item">
          <div class="top">
            账户余额(USDT)
          </div>
          <div class="btm">
            {{ NumberUtil.formatUsdt(totalAmount ) }}
          </div>
          <el-icon
            class="transfer-btn"
            @click="transfer"
          >
            <circle-plus />
          </el-icon>
        </div>
        <div class="item">
          <div class="top">
            净资产(USDT)
          </div>
          <div class="btm">
            {{ totalAmount === undefined ? '--' : NumberUtil.formatUsdt((totalAmount + orderAmountInfo.unsettleProfit)) }}
          </div>
        </div>
        <div class="item">
          <div class="top">
            持仓保证金(USDT)
          </div>
          <div class="btm">
            {{ NumberUtil.formatUsdt(orderAmountInfo.totalMargin) }}
          </div>
        </div>
        <div class="item">
          <div class="top">
            未实现盈亏(USDT)
          </div>
          <div class="btm">
            {{ NumberUtil.formatUsdt(orderAmountInfo.unsettleProfit) }}
          </div>
        </div>
        <div class="item">
          <div class="top">
            可用保证金(USDT)
          </div>
          <div class="btm">
            {{ NumberUtil.formatUsdt(calcAvailableMargin()) }}
          </div>
        </div>
        <div
          class="action"
          @click="changeMarginType"
        >
          {{ marginType ? (marginType === 'CROSSED' ? '全仓' : '逐仓'): '--' }}
        </div>
        <div
          class="action"
          @click="changeLeverage"
        >
          {{ leverage ? leverage + 'x' : '--' }}
        </div>
      </div>
    </div>

    <open-form
      class="open-form"
      v-if="type === 'MARKET'"
      ref="market-form"
      :type="type"
      @success="$emit('success')"
    />

    <open-form
      v-else
      class="open-form"
      ref="plan-form"
      :type="type"
      @success="$emit('success')"
    />

    <switch-margin-type
      ref="switch-margin-type"
      @success="marginType = $event"
    />
    <switch-leverage
      ref="switch-leverage"
      @success="updateLeverageSuccess"
    />
    <transfer-modal ref="transfer-modal" />
  </div>
</template>

<script>
  import OpenForm from './open-form'
  import SwitchMarginType from "./switch-margin-type"
  import Big from "big.js"
  import SwitchLeverage from "./switch-leverage";
  import {CirclePlus} from '@element-plus/icons'
  import TransferModal from "@/views/wallet/transfer-modal";

  export default {
    components: {TransferModal, SwitchLeverage, SwitchMarginType, OpenForm, CirclePlus},
    emits: ['success'],
    data() {
      return {
        type: localStorage.getItem('orderType') || 'MARKET',
        marginType: '',
        totalAmount: 0,
        leverage: '',
        orderAmountInfo: {
          unsettleProfit: 0,
          totalMargin: 0,
        }
      }
    },
    methods: {
      transfer() {
        if (this.leverage) {
          this.$refs['transfer-modal'].show()
        } else {
          this.$router.push('/login')
        }
      },
      changeLeverage() {
        if (this.leverage) {
          this.$refs['switch-leverage'].show(this.leverage)
        } else {
          this.$router.push('/login')
        }
      },
      changeMarginType() {
        if (this.marginType) {
          this.$refs['switch-margin-type'].show(this.marginType)
        } else {
          this.$router.push('/login')
        }
      },
      updateLeverageSuccess(leverage) {
        this.leverage = leverage
      },
      calcAvailableMargin() {
        let availableAmount = new Big(this.totalAmount).plus(new Big(this.orderAmountInfo.unsettleProfit)).minus(new Big(this.orderAmountInfo.totalMargin))
        availableAmount = availableAmount < 0 ? 0 : availableAmount

        if (this.$refs['market-form']) {
          this.$refs['market-form'].updateAvailableAmount(availableAmount)
        }
        if (this.$refs['plan-form']) {
          this.$refs['plan-form'].updateAvailableAmount(availableAmount)
        }
        return availableAmount
      },
      changeType(type) {
        this.type = type
        localStorage.setItem('orderType', type)
      },
      updateAccount(account) {
        this.totalAmount = account.assets['CONTRACT']
        this.marginType = account.marginType
      },
      updateOrderAmountInfo(orderAmountInfo) {
        this.orderAmountInfo = orderAmountInfo
      },
    },
    mounted() {
      if (this.$store.getters.getUserInfo.uid) {
        this.leverage = localStorage.getItem('leverage-' + (this.$route.query.symbol || 'BTCUSDT')) || '20'
      } else {
        this.leverage = ''
        this.marginType = ''
      }
    },
    watch: {
      '$route'(newRoute) {
        if (this.$store.getters.getUserInfo.uid) {
          this.leverage = localStorage.getItem('leverage-' + (newRoute.query.symbol || 'BTCUSDT')) || '20'
        } else {
          this.leverage = ''
          this.marginType = ''
        }
      }
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

      .tab {
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

        .item {
          position: relative;
          width: 150px;
          display: inline-block;
          font-size: 13px;
          border-right: 1px solid var(--app-border-color);
          text-align: center;
          margin-top: 6px;

          .top {
            font-size: 12px;
          }

          .btm {
            font-size: 15px;
            color: var(--app-text-color-light);
          }

          .transfer-btn {
            position: absolute;
            right: 5px;
            top: 10px;
            font-size: 18px;
            cursor: pointer;
            color: var(--el-color-primary);
          }
        }

        .action {
          float: right;
          width: 50px;
          display: inline-block;
          font-size: 13px;
          border-right: 1px solid var(--app-border-color);
          text-align: center;
          margin-top: 15px;
          cursor: pointer;
          color: var(--el-color-primary);
        }
      }
    }

    .open-form {
    }
  }
</style>
