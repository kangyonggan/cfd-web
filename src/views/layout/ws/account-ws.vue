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
      if (!this.$store.getters.getUserInfo.token) {
        this.closeWs()
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
          that.$eventBus.emit('updateAccount', data)
        } else if (event === 'ORDER_HELD_UPDATE') {
          // 持仓订单更新
          that.$eventBus.emit('updateOrderHeldList', data)
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
  },
  mounted() {
    this.initWs()
    this.$eventBus.on('sendAccountMsg', this.sendMsg)
  },
  watch: {
    '$route'() {
      this.initWs()
    }
  }
}
</script>
