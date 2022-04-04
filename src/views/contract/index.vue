<template>
  <div>
    <symbol-list />
    <kline
      ref="kline"
    />

    <order-form
      ref="order-form"
      @update-margin-coin-config="updateMarginCoinConfig"
      @success="$refs['order-list'].reload()"
    />

    <order-list
      ref="order-list"
      @success="$refs['order-form'].reload()"
    />
  </div>
</template>

<script>
import SymbolList from "./symbol-list"
import Kline from "./kline"
import OrderForm from './order-form'
import OrderList from "./order-list"

export default {
  components: {OrderList, Kline, SymbolList, OrderForm},
  methods: {
    updateMarginCoinConfig(marginCoinConfig) {
      this.$refs['kline'].updateMarginCoinConfig(marginCoinConfig)
    }
  }
}
</script>
