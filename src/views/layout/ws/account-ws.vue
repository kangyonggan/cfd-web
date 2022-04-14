<template>
  <div />
</template>


<script>
import Env from '@/util/env'
import Big from "big.js"

export default {
  data() {
    return {
      ws: undefined,
      retryCount: 0,
      oldReq: [{method: 'REQ', topic: 'ACCOUNT'}, {method: 'REQ', topic: 'ORDER_HELD'}, {method: 'REQ', topic: 'ORDER_DELEGATE'}],
      orderHeldList: [],
      ticketMap: {},
      totalAmount: 0,
      lastCalcTime: 0
    }
  },
  methods: {
    /**
     * 初始化ws
     */
    initWs() {
      if (!this.$store.getters.getUserInfo.token) {
        this.closeWs()
        this.$eventBus.emit('updateOrderHeldList', [])
        this.$eventBus.emit('updateOrderAmountInfo', {unsettleProfit: 0, totalMargin: 0})
        return
      }
      if (this.ws && this.ws.readyState === 1) {
        return
      }
      this.ws = new WebSocket(Env.wsHost + '/ws/account?Authorization=' + this.$store.getters.getUserInfo.token)

      let that = this;
      this.ws.onopen = function () {
        if (that.oldReq.length) {
          for (let i = 0; i < that.oldReq.length; i++) {
            that.sendMsg(that.oldReq[i])
          }
          that.oldReq = []
        }
      }
      this.ws.onmessage = function (e) {
        let msg = JSON.parse(e.data)
        let event = msg.event
        let data = msg.data

        if (event === 'PING') {
          // 心跳，回应 pong
          that.sendHeartbeat()
        } else if (event === 'ACCOUNT_UPDATE') {
          // 账户更新
          that.totalAmount = data.assets['CONTRACT']
          that.$eventBus.emit('updateAccount', data)
        } else if (event === 'ORDER_HELD_UPDATE') {
          // 持仓订单更新
          that.refreshOrderHeldList(data)
        } else if (event === 'ORDER_DELEGATE_UPDATE') {
          // 委托订单更新
          that.$eventBus.emit('updateOrderDelegateList', data)
        } else if (event === 'ERROR') {
          that.$error(data)
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
    sendReq(reqTopics) {
      for (let i = 0; i < reqTopics.length; i++) {
        let req = {
          method: 'REQ',
          topic: reqTopics[i]
        }
        this.sendMsg(req)
      }
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
    updateTicket(ticket) {
      this.ticketMap[ticket.symbol] = ticket

      if (this.$store.getters.getUserInfo.uid) {
        if (new Date().getTime() - this.lastCalcTime > 1000) {
          this.refreshOrderHeldList(this.orderHeldList)
        }
      } else {
        this.orderHeldList = []
      }
    },
    calcProfit(row) {
      let lastPrice = this.ticketMap[row.quotationCoin + row.marginCoin]
      if (!lastPrice) {
        return {
          lastPrice: '',
          profit: '',
          addIcon: '',
          profitClass: '',
          profitRate: '',
        }
      }
      lastPrice = lastPrice.close
      // 未实现盈亏 = 方向 * 保证金 * 杠杆 * (最新价-开仓价)/开仓价
      let pos = row.positionSide === 'LONG' ? 1 : -1
      let profit = new Big(pos * row.margin * row.leverage * (lastPrice - row.openPrice)).div(row.openPrice)
      // 回报率 = 方向 * 杠杆 * (最新价-开仓价)/开仓价
      let profitRate = new Big(pos * row.leverage * (lastPrice - row.openPrice)).div(row.openPrice)

      let addIcon = profitRate > 0 ? '+' : ''

      return {
        lastPrice: lastPrice,
        profit: profit,
        addIcon: addIcon,
        profitClass: profitRate > 0 ? 'bullish' : profitRate < 0 ? 'bearish' : '',
        profitRate: addIcon + this.NumberUtil.format(profitRate * 100, 2) + '%',
      }
    },
    refreshOrderHeldList(orderHeldList) {
      this.lastCalcTime = new Date().getTime()
      let totalUnsettleProfit = 0
      let totalMargin = 0
      let marginType = localStorage.getItem('marginType') || 'CROSSED'
      for (let i = 0; i < orderHeldList.length; i++) {
        let item = orderHeldList[i]
        let res = this.calcProfit(item)
        item.lastPrice = res.lastPrice || undefined
        item.addIcon = res.addIcon
        item.profit = res.profit
        item.profitRate = res.profitRate
        item.profitClass = res.profitClass
        if (marginType === 'ISOLATED') {
          // 逐仓保证金率 = (保证金 + 未实现盈亏 + 资金费) / 保证金
          item.marginRate = this.NumberUtil.formatUsdt((item.margin + item.profit + item.fundFee) / item.margin * 100) + '%'
        }
        orderHeldList[i] = item

        totalUnsettleProfit += res.profit * 1
        totalMargin += item.margin
      }

      totalUnsettleProfit = this.NumberUtil.formatUsdt(totalUnsettleProfit) * 1
      totalMargin = this.NumberUtil.formatUsdt(totalMargin) * 1

      // 全仓保证金率 = 净资产 / 总保证金 = (总资产 + 总未实现盈亏) / 总保证金
      let marginRate = '--'
      if (marginType === 'CROSSED' && orderHeldList.length > 0) {
        marginRate = this.NumberUtil.formatUsdt((this.totalAmount + totalUnsettleProfit) / totalMargin * 100) + '%'
      }

      this.$eventBus.emit('updateOrderAmountInfo', {unsettleProfit: totalUnsettleProfit, totalMargin: totalMargin, marginRate: marginRate})

      let totalAmount = this.totalAmount + totalUnsettleProfit

      // 强平价=开仓价-(账户余额-0.1*保证金)*方向/保证金/杠杆*开仓价（逐仓把账户余额换成保证金并加上资金费）
      // 由于账户余额中加上了未实现盈亏，所以开仓价用最新价替换（逐仓还是用开仓价）
      for (let i = 0; i < orderHeldList.length; i++) {
        let item = orderHeldList[i]
        let pos = new Big(item.positionSide === 'LONG' ? 1 : -1)
        let totalMargin = new Big(item.marginType === 'CROSSED' ? totalAmount : item.margin + item.fundFee)
        if (!item.lastPrice) {
          continue
        }
        let openPrice = new Big(item.marginType === 'CROSSED' ? item.lastPrice : item.openPrice)
        let forceClosePrice = openPrice.minus(
          (
            totalMargin.minus(
              new Big(0.1).times(new Big(item.margin))
            ).times(pos)
          ).div(
            new Big(item.margin).times(new Big(item.leverage))
          ).times(
            new Big(openPrice)
          )
        )
        if (forceClosePrice <= 0) {
          forceClosePrice = '永不强平'
          item.forceClosePrice = forceClosePrice
        } else {
          item.forceClosePrice = this.NumberUtil.format(forceClosePrice, this.$store.getters.getQuotationMap[item.quotationCoin + item.marginCoin].quotationPrecision)
        }
        orderHeldList[i] = item
      }

      this.orderHeldList = orderHeldList
      this.$eventBus.emit('updateOrderHeldList', orderHeldList)
    },
  },
  mounted() {
    this.initWs()
    this.$eventBus.on('sendAccountMsg', this.sendMsg)
    this.$eventBus.on('updateTicket', this.updateTicket)
  },
  watch: {
    '$route'() {
      this.initWs()
    }
  }
}
</script>
