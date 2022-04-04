<template>
  <div class="kline-header">
    <ul>
      <li
        v-for="int in intervalList"
        :key="int.code"
        :class="{active: int.code === interval}"
        @click="changeInterval(int.code)"
      >
        {{ int.val }}
      </li>
    </ul>

    <span style="font-size: 13px;float: right;margin-right: 10px;margin-top: 5px;">
      资金费率：{{ fundFeeRate === '' ? '--' : fundFeeRate }}
    </span>

    <span
      :class="priceColor"
      style="font-size: 18px;float: right;margin-right: 20px;"
    >
      {{ lastPrice }}{{ priceColor === 'bullish' ? '↑' : priceColor === 'bearish' ? '↓' : ' ' }}
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      symbol: '',
      interval: '',
      fundFeeRate: '',
      lastPrice: '--',
      priceColor: '',
      intervalList: [
        {
          code: '1m',
          val: '1分钟',
        },
        {
          code: '5m',
          val: '5分钟',
        },
        {
          code: '15m',
          val: '15分钟',
        },
        {
          code: '30m',
          val: '30分钟',
        },
        {
          code: '1h',
          val: '1小时',
        },
        {
          code: '4h',
          val: '4小时',
        },
        {
          code: '1d',
          val: '1天',
        },
        {
          code: '1w',
          val: '1周',
        },
        {
          code: '1M',
          val: '1月',
        }
      ],
    };
  },
  methods: {
    /**
     * 修改周期
     */
    changeInterval(interval) {
      this.interval = interval
      localStorage.setItem('interval', interval)
      this.$router.push({
        to: '/',
        query: {
          symbol: this.symbol,
          interval: interval
        }
      })
    },
    updateLastPrice(lastPrice) {
      let oldPrice = this.lastPrice === '--' ? 0 : this.lastPrice
      this.priceColor = oldPrice <= lastPrice ? 'bullish' : 'bearish'
      this.lastPrice = lastPrice
    }
  },
  mounted() {
    this.symbol = this.$route.query.symbol || 'BTCUSDT'
    this.interval = this.$route.query.interval || localStorage.getItem('interval') || '1h'
  },
  watch: {
    '$route.query.symbol': function () {
      this.symbol = this.$route.query.symbol || 'BTCUSDT'
    }
  }
};
</script>

<style scoped lang="scss">
.kline-header {
  height: 30px;

  .bullish {
    color: var(--el-color-success);
  }
  .bearish {
    color: var(--el-color-danger);
  }

  ul {
    float: left;
    list-style: none;
    height: 30px;
    padding: 0;
    margin: 0;

    li {
      float: left;
      height: 30px;
      line-height: 30px;
      font-size: 13px;
      cursor: pointer;
      padding: 0 8px;
      color: var(--app-text-color);
    }

    li.active {
      color: var(--el-color-primary);
    }

    li:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
