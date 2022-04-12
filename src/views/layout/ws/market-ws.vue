<template>
  <div />
</template>


<script>
import Env from '@/util/env'

export default {
  data() {
    return {
      ws: undefined,
      retryCount: 0,
      oldReq: []
    }
  },
  methods: {
    /**
     * 初始化ws
     */
    initWs() {
      if (this.ws && this.ws.readyState === 1) {
        return
      }
      this.ws = new WebSocket(Env.wsHost + '/ws/market')
      this.ws.onopen = function () {
        that.sendMsg({method: 'REQ', topic: 'QUOTATION_LIST'})
        if (that.oldReq.length) {
          for (let i = 0; i < that.oldReq.length; i++) {
            that.sendMsg(that.oldReq[i])
          }
          that.oldReq = []
        }
      }

      let that = this;
      this.ws.onmessage = function (e) {
        let msg = JSON.parse(e.data)
        let event = msg.event
        let data = msg.data

        if (event === 'TICKET') {
          // 最新价 & 涨跌幅 & 资金费率
          that.$eventBus.emit('updateTicket', data)
        } else if (event === 'HISTORY') {
          // 历史K线
          that.$eventBus.emit('updateHistory', data)
        } else if (event === 'KLINE') {
          // 最新K线
          that.$eventBus.emit('updateKline', data)
        } else if (event === 'QUOTATION_LIST') {
          // 行情列表
          that.$eventBus.emit('updateQuotationList', data)
          let quotationMap = {}
          let topics = ''
          for (let i = 0; i < data.length; i++) {
            let symbol = data[i].quotationCoin + data[i].marginCoin
            quotationMap[symbol] = data[i]
            if (i > 0) {
              topics += ','
            }
            topics += 'TICKET_' + symbol
          }
          that.sendMsg({method: 'SUB', topic: topics})
          that.$store.commit('setQuotationMap', quotationMap)
        } else if (event === 'PING') {
          // 心跳，回应 pong
          that.sendHeartbeat()
        }
      }

      this.ws.onclose = function () {
        that.closeWs()

        that.retryCount %= 10
        that.retryCount++
        let timeout = that.retryCount * 2000
        setTimeout(function () {
          that.initWs()
        }, timeout)
      }
    },
    closeWs() {
      if (this.ws) {
        this.ws.close()
      }
      this.ws = undefined
    },
    sendHeartbeat() {
      let req = {
        method: 'REQ',
        topic: 'PONG'
      }
      this.sendMsg(req)
    },
    sendMsg(req) {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify(req))
      } else {
        this.oldReq.push(req)
      }
    },
  },
  mounted() {
    this.initWs()
    this.$eventBus.on('sendMsg', this.sendMsg)
  },
  watch: {
    '$route'() {
      this.initWs()
    }
  }
}
</script>
