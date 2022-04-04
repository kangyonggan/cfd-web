<template>
  <div class="kline">
    <kline-header ref="kline-header" />
    <kline-body
      ref="kline-body"
      :loading="loading"
    />
  </div>
</template>

<script>
import KlineHeader from "./kline-header"
import KlineBody from "./kline-body"
import Env from '@/util/env'

export default {
  emits: ['updateLastPrice', 'updateTicket'],
  components: {KlineHeader, KlineBody},
  data() {
    return {
      loading: false,
      ws: undefined,
      symbol: '',
      interval: '',
      retryCount: 0
    }
  },
  methods: {
    /**
     * 初始化ws
     */
    initWs() {
      this.ws = new WebSocket(Env.wsHost + '/ws/market')

      let that = this;
      this.ws.onopen = function () {
        // 订阅K线并自动获取一次历史K线，自动推送全部交易对的最新价
        that.sub()
      }

      this.ws.onmessage = function (e) {
        let msg = JSON.parse(e.data)
        let event = msg.event
        let topic = msg.topic
        let data = msg.data
        if (event === 'history' && topic === that.symbol + '@' + that.interval) {
          // 历史K线
          that.$refs['kline-body'].kline.applyNewData(msg.data)
          that.loading = false
        } else if (event === 'kline' && topic === that.symbol + '@' + that.interval) {
          // K线
          if (!that.loading) {
            // 历史K线加载之后，再去画最新K线
            if (that.$refs['kline-body']) {
              that.$refs['kline-body'].kline.updateData(data)
            }
          }

          // 最新价
          let lastPrice = data.close * 1
          that.$emit('updateLastPrice', lastPrice)
          that.$refs['kline-header'].updateLastPrice(lastPrice)
        } else if (event === 'ticket') {
          // 最新价 & 涨跌幅 & 成交量
          that.$emit('updateTicket', data)
        } else if (event === 'ping') {
          // 心跳，回应 pong
          that.sendHeartbeat()
        }
      }

      this.ws.onclose = function () {
        if (that.ws) {
          that.ws.close()
        }
        that.ws = undefined

        that.retryCount %= 10
        that.retryCount++
        let timeout = that.retryCount * 2000
        setTimeout(function () {
          that.initWs()
        }, timeout)
      }
    },
    sendHeartbeat() {
      let req = {
        topic: 'pong'
      }
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(req))
      }
    },
    sub() {
      this.symbol = this.$route.query.symbol || 'BTCUSDT'
      this.interval = this.$route.query.interval || localStorage.getItem('interval') || '1h'
      this.loading = true

      let req = {
        topic: 'sub',
        data: this.symbol + '@' + this.interval
      }
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(req))
      }
    },
    updateMarginCoinConfig(marginCoinConfig) {
      this.$refs['kline-header'].updateMarginCoinConfig(marginCoinConfig)
    }
  },
  mounted() {
    this.initWs()
  },
  watch: {
    '$route.query.symbol': function () {
      this.sub()
    },
    '$route.query.interval': function () {
      this.sub()
    }
  }
}
</script>

<style scoped lang="scss">
.kline {
  height: 388px;
  width: calc(100% - 332px);
  float: left;
}
</style>
