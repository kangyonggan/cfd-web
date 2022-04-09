<template>
  <div />
</template>


<script>
  import Env from '@/util/env'

  export default {
    emits: ['account-update', 'order-held-update', 'order-delegate-update'],
    props: {
      req: {
        required: false,
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        ws: undefined,
        retryCount: 0,
      }
    },
    methods: {
      /**
       * 初始化ws
       */
      initWs() {
        if (!this.$store.getters.getUserInfo.token) {
          if (that.ws) {
            that.ws.close()
          }
          that.ws = undefined
          return
        }
        this.ws = new WebSocket(Env.wsHost + '/ws/account?Authorization=' + this.$store.getters.getUserInfo.token)

        let that = this;
        this.ws.onopen = function () {
          that.sendWs()
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
            that.$emit('account-update', data)
          } else if (event === 'ORDER_HELD_UPDATE') {
            // 持仓订单更新
            that.$emit('order-held-update', data)
          } else if (event === 'ERROR') {
            that.$error(data)
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
      sendWs() {
        for (let i = 0; i < this.req.length; i++) {
          let req = {
            method: 'REQ',
            topic: this.req[i]
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
        }
      },
    },
    activated() {
      this.initWs()
    }
  }
</script>
