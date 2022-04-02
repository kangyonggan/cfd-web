<template>
  <div>
    <sidebar code="capital" />

    <div class="content">
      <div class="overview">
        <div class="actions">
          <div class="asset">
            总资产：88888888.88888888 BTC ≈ <span>$88888888.88888888</span>
          </div>
          <div style="margin-top: 30px;">
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
            <el-button plain>
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
              {{ NumberUtil.format(item.totalAmount) }}
            </div>
            <div style="text-align: center">
              {{ NumberUtil.format(item.frozenAmount) }}
            </div>
            <div style="text-align: right">
              {{ NumberUtil.format(item.totalAmount - item.frozenAmount) }}
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
        <ul class="log-list">
          <li>
            <div>
              币种
            </div>
            <div>
              类型
            </div>
            <div class="large">
              金额
            </div>
            <div class="large">
              时间
            </div>
            <div style="width: 10%;text-align: right">
              详情
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
              {{ item.type }}
            </div>
            <div class="large">
              {{ NumberUtil.format(item.amount) }}
            </div>
            <div class="large">
              {{ DateTimeUtil.format(item.createTime) }}
            </div>
            <div style="width: 10%;text-align: right">
              <el-icon style="cursor: pointer;font-size: 18px;">
                <View />
              </el-icon>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import {View} from '@element-plus/icons'

  export default {
    components: {Sidebar, View},
    data() {
      return {
        loading: false,
        currencyList: [{
          currency: 'USDT',
          totalAmount: 88888888.88888888,
          frozenAmount: 0,
        }],
        currency: '',
        accountLogList: [{
          currency: 'USDT',
          type: '充值',
          amount: 1000,
          createTime: 1648912000118,
        }, {
          currency: 'USDT',
          type: '划转',
          amount: 200,
          createTime: 1648912000118,
        }]
      }
    },
    methods: {},
    mounted() {
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
          width: 15%;
        }

        .large {
          width: 30%;
          text-align: right;
        }
      }

      li:first-child {
        padding-top: 0;
      }
    }
  }
</style>
