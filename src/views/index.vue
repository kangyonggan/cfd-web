<template>
  <div style="padding: 30px 50px;">
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
            @keyup.enter.native="toLogin"
            autocomplete="off"
          />
          <el-button
            type="primary"
            @click="toLogin"
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
          <div>
            交易对
          </div>
          <div class="left">
            最新价
          </div>
          <div class="right2">
            24h涨跌
          </div>
        </li>
        <li
          class="item"
          v-for="item in quotationList"
          :key="item.quotationCoin"
        >
          <div>
            <router-link
              style="text-decoration: none;"
              :to="'/contract?symbol=' + item.quotationCoin + item.marginCoin"
            >
              <span style="color: var(--el-color-primary);">{{ item.quotationCoin }}</span><span
                style="font-size: 13px;color: var(--app-text-color-dark)"
              >/{{ item.marginCoin }}</span>
            </router-link>
          </div>
          <div :class="'left ' + item.priceColorClass">
            <span v-if="item.lastPrice">
              ${{ NumberUtil.formatUsdt(item.lastPrice, $store.getters.getQuotationMap[item.quotationCoin + item.marginCoin].quotationPrecision) }}
            </span>
            <span v-else>
              --
            </span>
          </div>
          <div :class="'right2 ' + (item.rose > 0 ? 'bullish' : item.rose < 0 ? 'bearish' : '')">
            {{ NumberUtil.format(item.rose * 100, 2) }}%
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        quotationList: [],
      }
    },
    methods: {
      toLogin() {
        this.$router.push({
          path: '/login',
          query: {
            email: this.email
          }
        })
      },
      updateTicket(ticket) {
        for (let i = 0; i < this.quotationList.length; i++) {
          let item = this.quotationList[i]
          if (item.quotationCoin + item.marginCoin === ticket.symbol) {
            if (item.lastPrice) {
              item.priceColorClass = item.lastPrice <= ticket.close ? 'bullish' : 'bearish'
            }
            item.lastPrice = ticket.close
            item.rose = ticket.rose
            this.quotationList[i] = item
            break
          }
        }
      },
    },
    mounted() {
      this.$eventBus.on('updateTicket', this.updateTicket)
      this.quotationList = Object.values(this.$store.getters.getQuotationMap)
      this.$eventBus.on('updateQuotationList', quotationList => {
        if (!this.quotationList.length) {
          this.quotationList = quotationList
        }
      })
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

        div {
          display: inline-block;
          width: 50%;
          text-align: left;
        }

        .left {
          width: 25%;
          text-align: left;
        }

        .right2 {
          width: 25%;
          text-align: right;
        }
      }

      .item {
        height: 64px;
        line-height: 64px;
      }

      .item:hover {
        background: var(--app-bg-color-light);
      }
    }
  }
</style>

