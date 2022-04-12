<template>
  <div class="main">
    <sidebar code="contract" />

    <div class="content">
      <div class="overview">
        <div class="asset">
          {{ NumberUtil.format((account.totalAmount + orderAmountInfo.unsettleProfit)) }} USDT

          <el-button
            style="float: right"
            plain
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

      <el-tabs
        v-model="activeTab"
        class="tabs"
        @tab-click="changeTab"
      >
        <el-tab-pane
          label="当前持仓"
          name="0"
        >
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
        </el-tab-pane>
        <el-tab-pane
          label="资金流水"
          name="1"
        >
          <ul
            class="log-list"
            v-loading="loadingAccountLog"
          >
            <li>
              <div>
                币种
              </div>
              <div>
                类型
              </div>
              <div
                class="large"
                style="text-align: left"
              >
                流水号
              </div>
              <div class="large">
                金额
              </div>
              <div class="large">
                时间
              </div>
            </li>
            <li v-if="accountLogList.length === 0">
              <div style="text-align: center;width: 100%;color: var(--app-text-color-dark);font-size: 13px;">
                暂无数据
              </div>
            </li>
            <li
              v-for="item in accountLogList"
              :key="item.id"
            >
              <div>
                {{ item.currency }}
              </div>
              <div>
                {{ getTransferType(item.type) }}
              </div>
              <div
                class="large"
                style="text-align: left"
              >
                {{ item.serialNo }}
                <base-copy :value="item.serialNo" />
              </div>
              <div class="large">
                {{ item.amount >= 0 ? '+' : '' }}{{ item.amount }}
              </div>
              <div class="large">
                {{ DateTimeUtil.format(item.createTime) }}
              </div>
            </li>
          </ul>

          <el-pagination
            v-show="total > 10"
            style="margin: 10px 0;float:right"
            layout="prev, pager, next"
            @current-change="getAccountLog($event)"
            :total="total"
            :current-page="pageNum"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <transfer-modal
      ref="transfer-modal"
    />
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import TransferModal from "./transfer-modal"
  import BaseCopy from "@/components/base-copy"

  export default {
    components: {Sidebar, TransferModal, BaseCopy},
    data() {
      return {
        account: {},
        orderAmountInfo: {},
        orderHeldList: [],
        activeTab: '',
        accountLogList: [],
        loadingAccountLog: false,
        total: 0,
        pageNum: 1
      }
    },
    methods: {
      changeTab() {
        this.$router.push({
          path: '/wallet/contract',
          query: {
            tab: this.activeTab
          }
        })
      },
      getTransferType(type) {
        if (type === 'TRANSFER_IN') {
          return '划转-转入'
        } else if (type === 'TRANSFER_OUT') {
          return '划转-转出'
        } else if (type === 'CLOSE_PROFIT') {
          return '平仓收益'
        } else if (type === 'CLOSE_FEE') {
          return '平仓手续费'
        } else if (type === 'FUND_FEE') {
          return '资金费'
        }

        return  type
      },
      getAccountLog(pageNum) {
        if (!pageNum) {
          pageNum = 1
        }
        this.pageNum = pageNum
        this.loadingAccountLog = true
        this.axios.get('/v1/wallet/accountLog?accountType=CONTRACT&current=' + pageNum).then(data => {
          this.accountLogList = data.records
          this.total = data.total
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loadingAccountLog = false
        })
      },
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
      this.activeTab = this.$route.query.tab || '0'
      if (this.activeTab === '1') {
        this.getAccountLog()
      }

      this.$eventBus.on('updateAccount', this.updateAccount)
      this.$eventBus.on('updateOrderAmountInfo', this.updateOrderAmountInfo)
      this.$eventBus.on('updateOrderHeldList', this.updateOrderHeldList)
    },
    watch: {
      '$route': function (newRoute) {
        this.activeTab = newRoute.query.tab || '0'
        if (this.activeTab === '1') {
          this.getAccountLog()
        }
      }
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

    .tabs {
      margin-top: 40px;
      padding-bottom: 10px;

      .log-list {
        list-style: none;
        padding-left: 0;
        margin-top: 0;

        li {
          height: 35px;
          border-bottom: 1px solid var(--app-border-color);
          padding-top: 19px;

          div {
            display: inline-block;
            width: 14%;
          }

          .large {
            width: 24%;
            text-align: right;
          }
        }

        li:first-child {
          padding-top: 0;
        }
      }
    }
  }
</style>
