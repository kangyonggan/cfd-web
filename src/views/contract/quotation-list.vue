<template>
  <div class="quotation-list">
    <el-table
      v-loading="loading"
      :data="quotationList"
      :row-style="tableRowStyle"
      :cell-style="{padding: '5px'}"
      height="524"
      @row-click="changeSymbol"
    >
      <el-table-column
        label="交易对"
        :sortable="true"
        width="120"
      >
        <template #default="scope">
          {{ scope.row.quotationCoin }}/{{ scope.row.marginCoin }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastPrice"
        label="最新价"
        :sortable="true"
        align="right"
      >
        <template #default="scope">
          <span :class="ticketMap[scope.row.quotationCoin + scope.row.marginCoin].priceColorClass">
            {{ ticketMap[scope.row.quotationCoin + scope.row.marginCoin].close || '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rose"
        label="今日涨幅"
        :sortable="true"
        align="right"
        width="115"
      >
        <template #default="scope">
          <span
            v-if="ticketMap[scope.row.quotationCoin + scope.row.marginCoin].rose !== undefined"
            :class="ticketMap[scope.row.quotationCoin + scope.row.marginCoin].rose > 0 ? 'bullish' : ticketMap[scope.row.quotationCoin + scope.row.marginCoin].rose < 0 ? 'bearish' : ''"
          >
            {{ ticketMap[scope.row.quotationCoin + scope.row.marginCoin].rose >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(ticketMap[scope.row.quotationCoin + scope.row.marginCoin].rose * 100) }}%
          </span>
          <span v-else>
            --
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        quotationList: [],
        timer: undefined,
        ticketMap: {}
      }
    },
    methods: {
      tableRowStyle(e) {
        let style = {height: 0, cursor: 'pointer'}
        let symbol = this.$route.query.symbol || 'BTCUSDT'
        if (symbol === e.row.quotationCoin + e.row.marginCoin) {
          style.background = 'var(--app-bg-color-light2)'
        }
        return style
      },
      changeSymbol(row) {
        this.$router.push({
          to: '/',
          query: {
            symbol: row.quotationCoin + row.marginCoin,
            interval: this.interval
          }
        })
      },
      updateTicket(ticket) {
        let oldTicket = this.ticketMap[ticket.symbol]
        if (oldTicket.close) {
          ticket.priceColorClass = oldTicket.close <= oldTicket.close ? 'bullish' : 'bearish'
        }
        this.ticketMap[ticket.symbol] = ticket
      },
      loadQuotationList() {
        this.loading = true
        this.axios.get('/v1/market/quotationList').then(data => {
          for (let i = 0; i < data.length; i++) {
            let ticket = data[i]
            this.ticketMap[ticket.quotationCoin + ticket.marginCoin] = ticket
          }
          this.quotationList = data
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
    },
    activated() {
      this.loadQuotationList()
    }
  }
</script>

<style scoped lang="scss">
  .quotation-list {
    width: 330px;
    float: left;
    height: 524px;
    border-right: 1px solid var(--app-border-color);
  }
</style>
