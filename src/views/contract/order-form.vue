<template>
  <div class="order-form">
    <div class="header">
      <span
        :class="{active: type === 'MARKET'}"
        @click="changeType('MARKET')"
      >
        市价
      </span>
      <span
        :class="{active: type === 'LIMIT'}"
        @click="changeType('LIMIT')"
      >
        限价
      </span>
      <div class="actions">
        <span style="cursor: auto;color: var(--app-text-color);padding-right: 20px;">
          可用保证金 --
          <el-icon
            style="vertical-align: middle"
            v-if="$store.getters.getUserInfo.uid"
            @click="$refs['fund-transfer'].show('TOHY', 'USDT')"
          >
            <circle-plus style="font-size: 16px;color: var(--el-color-primary)" />
          </el-icon>
        </span>
        <span>
          --
        </span>
        <span>
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

    <fund-transfer
      ref="fund-transfer"
      @success="reload"
    />
  </div>
</template>

<script>
  import OpenForm from './open-form'
  import SwitchMarginType from "./switch-margin-type"
  import FundTransfer from '../wallet/transfer-modal.vue'
  import {CirclePlus} from '@element-plus/icons'

  export default {
    components: {SwitchMarginType, OpenForm, FundTransfer, CirclePlus},
    emits: ['success'],
    data() {
      return {
        symbol: '',
        type: localStorage.getItem('orderType') || 'MARKET',
        leverage: '20',
        marginType: 'CROSSED'
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
