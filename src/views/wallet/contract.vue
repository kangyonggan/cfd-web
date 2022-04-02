<template>
  <div>
    <sidebar code="contract" />

    <div class="content">
      <div class="overview">
        <div class="asset">
          总资产：88888888.88888888 BTC ≈ <span>$88888888.88888888</span>

          <el-button
            type="primary"
            style="float: right"
          >
            划转
          </el-button>
        </div>
        <div class="details">
          <div class="item">
            <div class="label">
              钱包余额(USDT)
            </div>
            <div class="value">
              88888888.88888888
            </div>
          </div>
          <div class="item">
            <div class="label">
              未实现盈亏(USDT)
            </div>
            <div class="value">
              88888888.88888888
            </div>
          </div>
          <div class="item">
            <div class="label">
              持仓保证金(USDT)
            </div>
            <div class="value">
              88888888.88888888
            </div>
          </div>
          <div class="item">
            <div class="label">
              可用保证金(USDT)
            </div>
            <div class="value">
              88888888.8888
            </div>
          </div>
        </div>
      </div>

      <div class="position-title">
        仓位
      </div>
      <el-table
        :data="orderList"
        style="width: 100%"
      >
        <el-table-column
          prop="date"
          label="合约"
          width="180"
        />
        <el-table-column
          prop="name"
          label="数量"
          width="180"
        />
        <el-table-column
          prop="address"
          label="开仓价"
        />
        <el-table-column
          prop="address"
          label="最新价"
        />
        <el-table-column
          prop="address"
          label="未实现盈亏"
        />
        <el-table-column
          prop="address"
          label="操作"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'

  export default {
    components: {Sidebar},
    data() {
      return {
        loading: false,
        orderList: []
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
      .asset {
        font-size: 20px;
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
          }

          .value {
            margin-top: 5px;
            font-size: 18px;
            color: var(--app-text-color-white)
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
