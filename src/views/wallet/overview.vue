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
            总资产：{{ totalAmount }} USDT
          </div>
          <div
            style="margin-top: 40px;"
            v-loading="loading"
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
          v-loading="loading"
        >
          <li>
            <div>
              资金账户
            </div>

            <div class="asset">
              {{ assets['CAPITAL'] }} USDT
            </div>
          </li>
          <li>
            <div>
              合约账户
            </div>

            <div class="asset">
              {{ assets['CONTRACT'] }} USDT
            </div>
          </li>
        </ul>
      </el-card>
    </div>

    <transfer-modal
      ref="transfer-modal"
      @success="getOverview"
    />
  </div>
</template>

<script>
import Sidebar from './sidebar'
import TransferModal from "./transfer-modal"

export default {
  components: {TransferModal, Sidebar},
  data() {
    return {
      loading: false,
      totalAmount: '',
      assets: {},
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
    /**
     * 账户概览
     */
    getOverview() {
      this.loading = true
      this.totalAmount = 0
      this.assets = {}
      this.optionOverview.series[0].data = []
      this.axios.get('/v1/wallet/overview').then(data => {
        this.totalAmount = data.totalAmount
        this.assets = data.assets
        let seriesData = [{
          value: data.assets['CAPITAL'],
          name: '资金账户'
        }, {
          value: data.assets['CONTRACT'],
          name: '合约账户'
        }]
        this.optionOverview.series[0].data = seriesData
      }).catch(res => {
        this.$error(res.msg)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.getOverview()
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
        font-size: 20px;
        font-weight: 500;
        margin-top: 50px;
        color: var(--app-text-color-light);

        span {
          font-size: 16px;
          opacity: 0.9;
          color: var(--app-text-color-dark);
        }
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
