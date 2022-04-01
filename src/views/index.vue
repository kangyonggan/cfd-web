<template>
  <div>
    <el-card class="header">
      <div class="description">
        <div class="title">
          未来，已来！
        </div>
        <div class="info">
          在全球顶尖的交易平台之上，探寻数字货币。
        </div>
        <div class="join">
          <el-input
            placeholder="使用邮箱验证码登录可快速注册"
            v-model="email"
            @keyup.enter.native="submit"
            autocomplete="off"
          />
          <el-button
            type="primary"
          >
            开始使用
          </el-button>
        </div>
      </div>

      <div class="introduce">
        <div class="item">
          <img
            src="../assets/imgs/introduce01.png"
            alt="coin"
          >
          <div class="desc">
            深入探索数字货币的世界
          </div>
        </div>
        <img
          class="intro"
          src="../assets/imgs/introduce00.png"
          alt="intro"
        >
      </div>
    </el-card>

    <div class="contract">
      <div class="title">
        合约市场
      </div>
      <ul>
        <li style="margin-bottom: 10px;">
          <span class="left">
            交易对
          </span>
          <span>
            最新价
          </span>
          <span class="right">
            24h涨跌
          </span>
        </li>
        <li class="item">
          <span class="left">
            BTCUSDT永续合约
          </span>
          <span>
            $47982.73
          </span>
          <span class="right">
            -5.23%
          </span>
        </li>
        <li class="item">
          <span class="left">
            ETHUSDT永续合约
          </span>
          <span>
            $3282.97
          </span>
          <span class="right">
            -3.76%
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    submit() {

    }
  },
  mounted() {
  }
}
</script>

<style scoped lang="scss">
  .header {
    height: 370px;

    .description {
      width: 420px;
      float: left;
      color: var(--app-text-color-white);

      .title {
        font-size: 64px;
        line-height: 75px;
        margin-top: 50px;
      }

      .info {
        font-size: 20px;
        line-height: 34px;
        margin-top: 80px;
      }

      .join {
        margin-top: 25px;

        .el-input {
          float: left;
          width: 280px;
        }

        .el-button {
          width: 110px;
          float: left;
          margin-left: 15px;
        }
      }
    }

    .introduce {
      float: right;

      .item {
        float: left;
        margin-right: 10px;

        img {
          width: 425px;
        }

        .desc {
          font-size: 28px;
          line-height: 36px;
          color: var(--app-text-color-white);
          text-align: center;
          margin-top: 10px;
        }
      }

      .intro {
        float: right;
        width: 160px;
      }
    }
  }

  .contract {
    margin-top: 30px;

    .title {
      font-weight: 600;
      font-size: 40px;
      line-height: 48px;
      color: var(--app-text-color-white);
    }

    ul {
      list-style: none;
      margin-top: 30px;
      padding-left: 0;

      li {
        padding: 0 20px;

        span {
          display: inline-block;
          width: 33.33%;
          text-align: center;
        }

        .left {
          text-align: left;
        }

        .right {
          text-align: right;
        }
      }

      .item {
        height: 64px;
        line-height: 64px;
        cursor: pointer;
      }

      .item:hover {
        background: var(--app-bg-color-light);
      }
    }
  }
</style>

