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
        <div class="action">
          {{ marginType ? (marginType === 'SINGLE' ? '逐仓' : '全仓'): '--' }}
        </div>
        <div class="action">
          {{ leverage }}x
        </div>
      </div>
    </div>

    <open-form
      class="open-form"
      v-if="type === 'MARKET'"
      ref="market-form"
      :leverage="leverage"
      :type="type"
      @success="$emit('success')"
    />

    <open-form
      v-else
      class="open-form"
      ref="plan-form"
      :leverage="leverage"
      :type="type"
      @success="$emit('success')"
    />

    <switch-margin-type
      ref="switch-margin-type"
    />
  </div>
</template>

<script>
  import OpenForm from './open-form'
  import SwitchMarginType from "./switch-margin-type"
  import Big from "big.js"

  export default {
    components: {SwitchMarginType, OpenForm},
    emits: ['success'],
    data() {
      return {
        type: localStorage.getItem('orderType') || 'MARKET',
        leverage: '20',
        marginType: 'CROSSED',
        totalAmount: 0,
        orderAmountInfo: {
          unsettleProfit: 0,
          totalMargin: 0,
        }
      }
    },
    methods: {
      calcAvailableMargin() {
        return new Big(this.totalAmount).plus(new Big(this.orderAmountInfo.unsettleProfit)).minus(new Big(this.orderAmountInfo.totalMargin))
      },
      changeType(type) {
        this.type = type
        localStorage.setItem('orderType', type)
      },
      updateAccount(account) {
        this.totalAmount = account.assets['CONTRACT']
      },
      updateOrderAmountInfo(orderAmountInfo) {
        this.orderAmountInfo = orderAmountInfo
      }
    },
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
