<template>
  <div>
    <quotation-list />
    <kline />
    <order-form />
    <order-list />
  </div>
</template>

<script>
import QuotationList from "./quotation-list"
import Kline from "./kline"
import OrderForm from './order-form'
import OrderList from "./order-list"

export default {
  components: {OrderList, Kline, QuotationList, OrderForm},
}
</script>
