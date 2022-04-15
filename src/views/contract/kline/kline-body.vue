<template>
  <div>
    <div
      v-loading="loading"
      id="kline"
    />
  </div>
</template>

<script>
import {init} from 'klinecharts'

export default {
  data() {
    return {
      loading: false,
      kline: undefined,
      resizeTag: true,
      indicators: [],
      symbol: '',
      interval: ''
    }
  },
  methods: {
    /**
     * 画K线
     */
    initKline() {
      // 初始化60
      this.kline = init('kline', {
        // 网格线
        grid: {
          show: false
        },
        // 蜡烛图
        candle: {
          bar: {
            upColor: '#13b887',
            downColor: '#eb4d5c'
          }
        },
      })
      this.resetKline()
    },
    changeIndicator(indicators) {
      // 先移除
      for (let i = 0; i < this.indicators.length; i++) {
        this.kline.removeTechnicalIndicator(this.indicators[i])
      }

      // 再添加
      this.indicators = indicators
      for (let i = 0; i < indicators.length; i++) {
        let name = indicators[i]
        this.kline.createTechnicalIndicator(name, false, {
          id: name
        })
        this.kline.overrideTechnicalIndicator({
          name: name,
          styles: {
            bar: {
              upColor: '#13b887',
              downColor: '#eb4d5c',
              noChangeColor: '#888888'
            },
            line: {
              size: 1,
              colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
            },
            circle: {
              upColor: '#13b887',
              downColor: '#eb4d5c',
              noChangeColor: '#888888'
            }
          }
        }, 'VOL')
      }
    },
    resetKline() {
      this.kline.setOffsetRightSpace(6)
      this.kline.setDataSpace(10)
      this.kline.resize()
      // this.changeIndicator(['VOL'])
    },
    unsubKline() {
      if (this.symbol) {
        // 取消订阅K线
        this.$eventBus.emit('sendMsg', {method: 'UNSUB', topic: 'KLINE_' + this.symbol + '@' + this.interval})
      }
    },
    subKline(symbol, interval) {
      this.loading = true

      // 取消订阅K线
      this.unsubKline()
      this.symbol = symbol
      this.interval = interval

      // 请求历史K线
      this.$eventBus.emit('sendMsg', {method: 'REQ', topic: 'HISTORY_' + symbol + '@' + interval})
      // 订阅K线
      this.$eventBus.emit('sendMsg', {method: 'SUB', topic: 'KLINE_' + symbol + '@' + interval})
    }
  },
  mounted() {
    this.initKline()

    let that = this
    window.onresize = () => {
      // 防抖
      if (that.resizeTag) {
        that.resizeTag = false
        setTimeout(() => {
          that.resizeTag = true
        }, 100)
        that.resetKline()
      }
    }

    // 监听历史K线
    this.$eventBus.on('updateHistory', data => {
      this.kline.applyNewData(data)
      this.resetKline()
      this.loading = false
      let item = that.$store.getters.getQuotationMap[this.symbol]
      if (item) {
        // 设置K线价格精度
        this.kline.setPriceVolumePrecision(item.quotationPrecision, 1)
      }
    })

    // 监听最新K线
    this.$eventBus.on('updateKline', data => {
      // 历史K线
      this.kline.updateData(data)
    })

    this.subKline(this.$route.query.symbol || 'BTCUSDT', this.$route.query.interval || localStorage.getItem('interval') || '1h')
  },
  watch: {
    '$route': function (newRoute) {
      let symbol = newRoute.query.symbol || 'BTCUSDT'
      let interval = newRoute.query.interval || localStorage.getItem('interval') || '1h'
      if (symbol !== this.symbol || interval !== this.interval) {
        this.subKline(symbol, interval)
      }
    },
  },
};
</script>

<style scoped lang="scss">
#kline {
  height: 370px;
}
</style>
