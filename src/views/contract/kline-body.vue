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
    props: {
      loading: {
        required: true,
        type: Boolean
      },
    },
    data() {
      return {
        kline: undefined,
        resizeTag: true,
        indicators: [],
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
    }
  };
</script>

<style scoped lang="scss">
  #kline {
    height: 370px;
  }
</style>
