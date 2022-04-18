<template>
  <div class="main">
    <sidebar code="overview" />

    <div class="content">
      <div class="overview">
        <v-chart
          style="height: 204px;width: 204px;float: left"
          :option="optionOverview"
          autoresize
        />
        <div class="actions">
          <div class="asset">
            {{ NumberUtil.format(account.totalAmount + orderAmountInfo.unsettleProfit) }} USDT
          </div>
          <div
            style="margin-top: 30px;"
          >
            <el-button
              type="primary"
            >
              充值
            </el-button>
            <el-button plain>
              提币
            </el-button>
            <el-button
              plain
              @click="transferInner"
            >
              转账
            </el-button>
            <el-button
              plain
              @click="$refs['transfer-modal'].show()"
            >
              划转
            </el-button>
          </div>
        </div>
      </div>

      <el-card style="margin-top: 10px;">
        <template #header>
          <span style="color: var(--app-text-color-light)">我的资产</span>
        </template>
        <ul
          class="account-list"
        >
          <li>
            <div>
              资金账户
            </div>

            <div class="asset">
              <span v-if="account.assets">
                {{ NumberUtil.format(account.assets['CAPITAL']) * 1 }} USDT
              </span>
              <span v-else>
                --
              </span>
            </div>
          </li>
          <li>
            <div>
              合约账户
            </div>

            <div class="asset">
              <span v-if="account.assets['CONTRACT']">
                {{ NumberUtil.format(account.assets['CONTRACT'] + orderAmountInfo.unsettleProfit) * 1 }} USDT
              </span>
              <span v-else>
                --
              </span>
            </div>
          </li>
        </ul>
      </el-card>
    </div>

    <transfer-modal ref="transfer-modal" />
    <transfer-inner-modal ref="transfer-inner-modal" />
  </div>
</template>

<script>
import Sidebar from './sidebar'
import TransferModal from "./transfer-modal"
import TransferInnerModal from "./transfer-inner-modal"

export default {
  components: {TransferModal, Sidebar, TransferInnerModal},
  data() {
    return {
      account: {
        totalAmount: 0,
        assets: {}
      },
      orderAmountInfo: {},
      optionOverview: {
        color: ['#5dccc8', '#fca235'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}（{d}%）<br/>${c}'
        },
        legend: {
          show: false
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            data: [
              {value: 0, name: '资金账户'},
              {value: 0, name: '合约账户'},
            ]
          }
        ]
      }
    }
  },
  methods: {
    transferInner() {
      if (!this.$store.getters.getUserInfo.hasPayPwd) {
        this.$warning('请先到账户管理中设置支付密码')
        return
      }
      this.$refs['transfer-inner-modal'].show()
    },
    /**
     * 账户概览
     */
    getOverview() {
      this.axios.get('/v1/wallet/overview').then(data => {
        this.updateAccount(data)
      }).catch(res => {
        this.$error(res.msg)
      })
    },
    refreshData() {
      this.optionOverview.series[0].data = [{
        value: this.account.assets['CAPITAL'],
        name: '资金账户'
      }, {
        value: this.account.assets['CONTRACT'] + this.orderAmountInfo.unsettleProfit,
        name: '合约账户'
      }]
    },
    updateOrderAmountInfo(orderAmountInfo) {
      this.orderAmountInfo = orderAmountInfo

      this.refreshData()
    },
    updateAccount(account) {
      this.account = account
    },
  },
  mounted() {
    this.getOverview()

    // 订阅账户 和 订单金额变化
    this.$eventBus.on('updateAccount', this.updateAccount)
    this.$eventBus.on('updateOrderAmountInfo', this.updateOrderAmountInfo)
  }
}
</script>

<style scoped lang="scss">
.content {
  float: right;
  width: calc(100% - 330px);

  .overview {
    height: 205px;

    .actions {
      float: left;

      .asset {
        font-size: 26px;
        font-weight: 500;
        margin-top: 50px;
        color: var(--app-text-color-light);
      }

      .el-button {
        letter-spacing: 8px;
        padding-left: 25px;
      }
    }
  }

  .account-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0;

    li {
      height: 35px;
      border-bottom: 1px solid var(--app-border-color);
      padding-top: 19px;

      div {
        display: inline-block;
        width: 30%;
      }

      .asset {
        width: 70%;
        text-align: right;
        color: var(--app-text-color-light);
      }
    }

    li:first-child {
      padding-top: 0;
    }
  }
}
</style>
