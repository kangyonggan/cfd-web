<template>
  <div class="quotation-list">
    <el-table
      v-loading="loading"
      :data="quotationList"
      :row-style="tableRowStyle"
      :cell-style="{padding: '5px'}"
      height="398"
      @row-click="changeSymbol"
    >
      <el-table-column
        label="交易对"
        :sortable="true"
        width="120"
      >
        <template #default="scope">
          <span style="color: var(--el-color-primary)">
            {{ scope.row.quotationCoin }}
          </span>
          <span style="font-size: 12px;color: var(--app-text-color-dark)">/{{ scope.row.marginCoin }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastPrice"
        label="最新价"
        :sortable="true"
        align="right"
      >
        <template #default="scope">
          <span :class="scope.row.priceColorClass">
            {{ scope.row.lastPrice || '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rose"
        label="24h涨跌"
        :sortable="true"
        align="right"
        width="115"
      >
        <template #default="scope">
          <span
            v-if="scope.row.rose !== undefined"
            :class="scope.row.rose > 0 ? 'bullish' : scope.row.rose < 0 ? 'bearish' : ''"
          >
            {{ scope.row.rose >= 0 ? '+' : '' }}{{ NumberUtil.formatUsdt(scope.row.rose * 100) }}%
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
    emits: ['updateQuotationList'],
    data() {
      return {
        loading: false,
        quotationList: [],
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
      loadQuotationList() {
        this.loading = true
        this.axios.get('/v1/market/quotationList').then(data => {
          let quotationMap = {}
          for (let i = 0; i < data.length; i++) {
            quotationMap[data[i].quotationCoin + data[i].marginCoin] = data[i]
          }
          this.$store.commit('setQuotationMap', quotationMap)

          this.quotationList = data
          this.$emit('updateQuotationList', data)
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
    },
    mounted() {
      this.loadQuotationList()
    }
  }
</script>

<style scoped lang="scss">
  .quotation-list {
    width: 330px;
    float: left;
    height: 398px;
    border-right: 1px solid var(--app-border-color);
  }
</style>
