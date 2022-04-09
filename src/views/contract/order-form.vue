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
        <span class="item">
          账户余额 {{ account.totalAmount === undefined ? '--' : account.totalAmount + ' USDT' }}
        </span>
        <span class="item">
          净资产 {{ account.netAmount === undefined ? '--' : account.netAmount + ' USDT' }}
        </span>
        <span class="item">
          持仓保证金 {{ account.frozenAmount === undefined ? '--' : account.frozenAmount + ' USDT' }}
        </span>
        <span class="item">
          未实现盈亏 {{ account.unsettleAmount === undefined ? '--' : account.unsettleAmount + ' USDT' }}
        </span>
        <span class="item">
          可用保证金 {{ account.availableAmount === undefined ? '--' : account.availableAmount + ' USDT' }}
        </span>
        <span class="item">
          --
        </span>
        <span class="item">
          {{ marginType ? (marginType === 'SINGLE' ? '逐仓' : '全仓'): '--' }}
        </span>
      </div>
    </div>

    <open-form
      class="open-form"
      v-if="type === 'MARKET'"
      ref="market-form"
      :symbol="symbol"
      :leverage="leverage"
      :type="type"
      @success="$emit('success')"
    />

    <open-form
      v-else
      class="open-form"
      ref="plan-form"
      :symbol="symbol"
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

  export default {
    components: {SwitchMarginType, OpenForm},
    emits: ['success'],
    data() {
      return {
        symbol: '',
        type: localStorage.getItem('orderType') || 'MARKET',
        leverage: '20',
        marginType: 'CROSSED',
        account: {}
      }
    },
    methods: {
      /**
       * 加载杠杆、可用保证金
       */
      reload() {
        this.symbol = this.$route.query.symbol || 'BTCUSDT'
      },
      changeType(type) {
        this.type = type
        localStorage.setItem('orderType', type)
      },
      updateAccount(account) {
        this.account = account.list[1]
      }
    },
    activated() {
      this.reload()
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
          display: inline-block;
          font-size: 13px;
          border-right: 1px solid var(--app-border-color);
          text-align: center;
          min-width: 60px;
          padding: 0 15px;
          margin-top: 15px;
        }

        .item:last-child {
          border-right: 0;
        }
      }
    }

    .open-form {
    }
  }
</style>
