<template>
  <div>
    <quotation-list
      ref="quotation-list"
      @update-quotation-list="updateQuotationList"
    />
    <kline
      ref="kline"
      @update-ticket="updateTicket"
    />

    <order-form
      ref="order-form"
      @update-margin-coin-config="updateMarginCoinConfig"
    />

    <order-list
      ref="order-list"
      @success="$refs['order-form'].reload()"
    />
  </div>
</template>

<script>
import QuotationList from "./quotation-list"
import Kline from "./kline"
import OrderForm from './order-form'
import OrderList from "./order-list"

export default {
  components: {OrderList, Kline, QuotationList, OrderForm},
  methods: {
    updateMarginCoinConfig(marginCoinConfig) {
      this.$refs['kline'].updateMarginCoinConfig(marginCoinConfig)
    },
    updateTicket(ticket) {
      this.$refs['quotation-list'].updateTicket(ticket)
    },
    updateQuotationList(list) {
      this.$refs['kline'].updateQuotationList(list)
    }
  }
}
</script>
