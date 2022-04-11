<template>
  <div class="main">
    <sidebar code="contract" />

    <div class="content">
      <div class="overview">
        <div class="asset">
          {{ NumberUtil.format((account.totalAmount + orderAmountInfo.unsettleProfit)) }} USDT

          <el-button
            type="primary"
            style="float: right"
            @click="$refs['transfer-modal'].show()"
          >
            划转
          </el-button>

          <router-link
            to="/wallet/contract/stat"
            style="cursor: pointer;color: var(--el-color-primary);font-size: 14px;float: right;margin-right: 20px;margin-top: 10px;text-decoration: none"
          >
            盈亏分析
          </router-link>
        </div>
        <div class="details">
          <div class="item">
            <div class="label">
              账户余额(USDT)
            </div>
            <div class="value">
              {{ NumberUtil.formatUsdt(account.totalAmount) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              未实现盈亏(USDT)
            </div>
            <div class="value">
              {{ NumberUtil.formatUsdt(orderAmountInfo.unsettleProfit) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              持仓保证金(USDT)
            </div>
            <div class="value">
              {{ NumberUtil.formatUsdt(orderAmountInfo.totalMargin) }}
            </div>
          </div>
          <div class="item">
            <div class="label">
              可用保证金(USDT)
            </div>
            <div class="value">
              {{ NumberUtil.formatUsdt(account.totalAmount - orderAmountInfo.totalMargin + orderAmountInfo.unsettleProfit) }}
            </div>
          </div>
        </div>
      </div>

      <div class="position-title">
        仓位
      </div>
      <el-table
        :data="orderHeldList"
        style="width: 100%"
      >
        <el-table-column
          prop="quotationCoin"
          label="交易对"
          min-width="100"
        >
          <template #default="scope">
            <div
              style="cursor: pointer"
              @click="changeSymbol(scope.row.quotationCoin + scope.row.marginCoin)"
            >
              <span style="color: var(--el-color-primary)">
                {{ scope.row.quotationCoin }}
              </span>
              <span style="font-size: 12px;color: var(--app-text-color-dark)">/{{ scope.row.marginCoin }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="positionSide"
          label="方向"
          min-width="100"
        >
          <template #default="scope">
            <span :class="scope.row.positionSide === 'LONG' ? 'bullish' : 'bearish'">
              {{ scope.row.positionSide === 'LONG' ? '做多' : '做空' }}({{ scope.row.leverage }}x)
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="margin"
          label="保证金"
          min-width="110"
        />
        <el-table-column
          prop="openPrice"
          label="开仓价格"
          min-width="100"
        >
          <template #default="scope">
            {{ scope.row.openPrice }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastPrice"
          label="最新价格"
          min-width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.lastPrice !== undefined">
              {{ scope.row.lastPrice }}
            </span>
            <span v-else>
              --
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unsettleProfit"
          label="未实现盈亏"
          min-width="170"
        >
          <template #default="scope">
            <span
              :class="scope.row.profitClass"
              v-if="scope.row.profit"
            >
              {{ scope.row.addIcon }}{{ NumberUtil.formatUsdt(scope.row.profit) }}({{ scope.row.profitRate }})
            </span>
            <span v-else>
              --
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="强平价格"
          min-width="110"
        >
          <template #default="scope">
            <span v-if="scope.row.forceClosePrice !== undefined">
              {{ scope.row.forceClosePrice }}
            </span>
            <span v-else>
              --
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <transfer-modal
      ref="transfer-modal"
    />
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import TransferModal from "./transfer-modal"

  export default {
    components: {Sidebar, TransferModal},
    data() {
      return {
        account: {},
        orderAmountInfo: {},
        orderHeldList: []
      }
    },
    methods: {
      changeSymbol(symbol) {
        this.$router.push({
          path: '/contract',
          query: {
            symbol: symbol,
            interval: this.$route.query.interval
          }
        })
        scrollTo(0, 0)
      },
      updateOrderAmountInfo(orderAmountInfo) {
        this.orderAmountInfo = orderAmountInfo
      },
      updateAccount(account) {
        this.account = account
      },
      updateOrderHeldList(orderHeldList) {
        this.orderHeldList = orderHeldList
      },
      getOverview() {
        this.axios.get('/v1/wallet/overview').then(data => {
          this.updateAccount(data)
        }).catch(res => {
          this.$error(res.msg)
        })
      },
    },
    mounted() {
      this.getOverview()

      this.$eventBus.on('updateAccount', this.updateAccount)
      this.$eventBus.on('updateOrderAmountInfo', this.updateOrderAmountInfo)
      this.$eventBus.on('updateOrderHeldList', this.updateOrderHeldList)
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 330px);

    .overview {
      .asset {
        font-size: 26px;
        font-weight: 500;
        margin-top: 10px;
        color: var(--app-text-color-light);
        padding-bottom: 20px;

        span {
          font-size: 16px;
          opacity: 0.9;
          color: var(--app-text-color-dark);
        }

        border-bottom: 1px solid var(--app-border-color);
      }

      .details {
        margin-top: 20px;
        height: 50px;

        .item {
          width: 25%;
          float: left;

          .label {
            opacity: 0.9;
            font-size: 14px;
          }

          .value {
            margin-top: 5px;
            font-size: 16px;
            color: var(--app-text-color-light)
          }
        }
      }
    }

    .position-title {
      margin-top: 40px;
      font-size: 18px;
      font-weight: bold;
      color: var(--app-text-color-light);
      padding-bottom: 10px;
    }
  }
</style>
