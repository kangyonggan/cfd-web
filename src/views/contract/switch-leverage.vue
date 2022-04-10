<template>
  <base-modal
    ref="modal"
    :title="'调整杠杆 ' + symbol"
    :auto-submit="false"
    :before-submit="submit"
  >
    <el-form-item
      prop="leverage"
      label="杠杆"
      style="margin-bottom: 0 !important;"
    >
      <el-input-number
        style="width: 80%"
        v-model="params.leverage"
        :min="minLeverage"
        :max="maxLeverage"
      />
    </el-form-item>
    <el-slider
      v-model="params.leverage"
      :min="minLeverage"
      :max="maxLeverage"
      :format-tooltip="formatTooltip"
      style="width: 64%;margin-top: 30px;margin-left: 95px;"
    />
  </base-modal>
</template>

<script>
import BaseModal from '@/components/base-modal.vue'

export default {
  emits: ['success'],
  components: {BaseModal},
  data() {
    return {
      maxLeverage: 0,
      minLeverage: 1,
      symbol: '',
      params: {
        leverage: '',
      }
    }
  },
  methods: {
    formatTooltip(value) {
      return value + 'x'
    },
    show() {
      this.symbol = this.$route.query.symbol || 'BTCUSDT'
      this.maxLeverage = this.$store.getters.getQuotationMap[this.symbol].maxLeverage
      this.minLeverage = this.$store.getters.getQuotationMap[this.symbol].minLeverage
      let leverage = localStorage.getItem('leverage-' + this.symbol) || '20'
      this.params.leverage = leverage * 1
      this.$refs.modal.show()
    },
    submit() {
      this.$refs.modal.close()
      localStorage.setItem('leverage-' + this.symbol, this.params.leverage)
      this.$emit('success', this.params.leverage)
    }
  }
}
</script>

