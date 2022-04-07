<template>
  <div style="width: 100%">
    <open-form-content
      ref="buy-form"
      :delegate-type="delegateType"
      :symbol="symbol"
      :leverage="leverage"
      style="width: calc(50% - 40px);float: left;padding: 15px 20px"
      oper-type="LONG"
      :margin-coin-config="marginCoinConfig"
      @success="$emit('success')"
    />
    <open-form-content
      ref="sell-form"
      :delegate-type="delegateType"
      :symbol="symbol"
      :leverage="leverage"
      style="width: calc(50% - 40px);float: left;padding: 15px 20px"
      oper-type="SHORT"
      :margin-coin-config="marginCoinConfig"
      @success="$emit('success')"
    />
  </div>
</template>

<script>
  import OpenFormContent from "./open-form-content"

  export default {
    emits: ['success'],
    components: {OpenFormContent},
    props: {
      delegateType: {
        required: true,
        type: String
      },
      marginCoinConfig: {
        required: true,
        type: Object
      },
      symbol: {
        required: true,
        type: String
      },
      leverage: {
        required: true,
        type: String
      },
    },
    methods: {
    }
  }
</script>
