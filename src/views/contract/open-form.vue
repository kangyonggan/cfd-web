<template>
  <div style="width: 100%">
    <open-form-content
      ref="buy-form"
      :type="type"
      :symbol="symbol"
      :leverage="leverage"
      style="width: calc(50% - 40px);float: left;padding: 15px 20px"
      position-side="LONG"
      @success="$emit('success')"
    />
    <open-form-content
      ref="sell-form"
      :type="type"
      :symbol="symbol"
      :leverage="leverage"
      style="width: calc(50% - 40px);float: left;padding: 15px 20px"
      position-side="SHORT"
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
      type: {
        required: true,
        type: String
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
