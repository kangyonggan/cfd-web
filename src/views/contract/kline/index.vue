<template>
  <div class="kline">
    <kline-header ref="kline-header" />
    <kline-body ref="kline-body" />
  </div>
</template>

<script>
import KlineHeader from "./kline-header"
import KlineBody from "./kline-body"

export default {
  components: {KlineHeader, KlineBody},
}
</script>

<style scoped lang="scss">
.kline {
  height: 388px;
  width: calc(100% - 332px);
  float: left;
}
</style>
