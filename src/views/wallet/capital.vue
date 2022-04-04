<template>
  <div class="main">
    <sidebar code="capital" />

    <div class="content">
      <div class="overview">
        <div class="actions">
          <div class="asset">
            总资产：{{ totalAmount }} USDT
          </div>
          <div
            style="margin-top: 30px;"
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
        <ul class="currency-list">
          <li>
            <div style="width: 16%">
              币种
            </div>
            <div>
              全部
            </div>
            <div style="text-align: center">
              冻结
            </div>
            <div style="text-align: right">
              可用
            </div>
          </li>
          <li
            v-for="item in currencyList"
            :key="item.currency"
          >
            <div style="width: 16%">
              {{ item.currency }}
            </div>
            <div>
              {{ item.totalAmount }}
            </div>
            <div style="text-align: center">
              {{ item.frozenAmount }}
            </div>
            <div style="text-align: right">
              {{ item.totalAmount - item.frozenAmount }}
            </div>
          </li>
        </ul>
      </el-card>

      <el-card style="margin-top: 30px;">
        <template #header>
          <span style="color: var(--app-text-color-light)">资金流水</span>
          <el-select
            v-model="currency"
            style="float: right"
            size="small"
            @change="getAccountLog(1)"
          >
            <el-option
              label="全部币种"
              value=""
            />
            <el-option
              v-for="item in currencyList"
              :key="item.currency"
              :label="item.currency"
              :value="item.currency"
            />
          </el-select>
        </template>
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
            </div>
            <div class="large">
              {{ item.amount }}
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
      </el-card>
    </div>

    <transfer-modal
      ref="transfer-modal"
      @success="reload"
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
        loading: false,
        totalAmount: 0,
        currencyList: [],
        currency: '',
        loadingAccountLog: false,
        accountLogList: [],
        total: 0,
        pageNum: 1
      }
    },
    methods: {
      getTransferType(type) {
        if (type === 'TRANSFER_IN') {
          return '划转-转入'
        } else if (type === 'TRANSFER_OUT') {
          return '划转-转出'
        }

        return  type
      },
      getAccountDetail() {
        this.loading = true
        this.totalAmount = 0
        this.currencyList = []
        this.axios.get('/v1/wallet/accountDetail?accountType=CAPITAL').then(data => {
          this.totalAmount = data.totalAmount
          this.currencyList = data.list
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      getAccountLog(pageNum) {
        if (!pageNum) {
          pageNum = 1
        }
        this.pageNum = pageNum
        this.loadingAccountLog = true
        this.axios.get('/v1/wallet/accountLog?accountType=CAPITAL&current=' + pageNum + '&currency=' + this.currency).then(data => {
          this.accountLogList = data.records
          this.total = data.total
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loadingAccountLog = false
        })
      },
      reload() {
        this.getAccountDetail()
        this.getAccountLog()
      }
    },
    mounted() {
      this.reload()
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 330px);

    .overview {
      height: 140px;

      .actions {
        float: left;

        .asset {
          font-size: 20px;
          font-weight: 500;
          margin-top: 20px;
          color: var(--app-text-color-light);
        }

        .el-button {
          letter-spacing: 8px;
          padding-left: 25px;
        }
      }
    }

    .currency-list {
      list-style: none;
      padding-left: 0;
      margin-top: 0;

      li {
        height: 35px;
        border-bottom: 1px solid var(--app-border-color);
        padding-top: 19px;

        div {
          display: inline-block;
          width: 28%;
        }
      }

      li:first-child {
        padding-top: 0;
      }
    }

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
</style>
