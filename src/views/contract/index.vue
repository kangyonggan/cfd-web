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

    <base-account-ws
      :req="['ACCOUNT', 'ORDER_HELD']"
      @account-update="accountUpdate"
      @order-held-update="orderHeldUpdate"
    />
  </div>
</template>

<script>
import QuotationList from "./quotation-list"
import Kline from "./kline"
import OrderForm from './order-form'
import OrderList from "./order-list"
import BaseAccountWs from "@/components/base-account-ws"

export default {
  components: {OrderList, Kline, QuotationList, OrderForm, BaseAccountWs},
  methods: {
    updateMarginCoinConfig(marginCoinConfig) {
      this.$refs['kline'].updateMarginCoinConfig(marginCoinConfig)
    },
    updateTicket(ticket) {
      this.$refs['quotation-list'].updateTicket(ticket)
      this.$refs['order-list'].updateTicket(ticket)
    },
    updateQuotationList(list) {
      this.$refs['kline'].updateQuotationList(list)
    },
    accountUpdate(data) {
      this.$refs['order-form'].updateAccount(data)
    },
    orderHeldUpdate(orderHeldList) {
      this.$refs['order-list'].updateOrderHeld(orderHeldList)
    }
  },
}
</script>
