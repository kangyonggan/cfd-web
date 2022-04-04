<template>
  <base-modal
    ref="modal"
    :title="'调整杠杆 ' + symbol.toUpperCase()"
    :auto-submit="false"
    :before-submit="submit"
  >
    <el-form-item
      prop="leverage"
      label="杠杆"
      style="margin-bottom: 0 !important;"
    >
      <el-radio-group
        v-model="leverage"
        size="small"
        class="leverage-group"
      >
        <el-radio-button
          v-for="lv in leverageList"
          :key="lv"
          :label="lv"
        >
          {{ lv }}X
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'

  export default {
    components: {BaseModal},
    emits: ['success'],
    data() {
      return {
        symbol: '',
        leverage: '',
        leverageList: [],
      }
    },
    methods: {
      show(symbol, leverage, leverageList) {
        this.symbol = symbol
        this.leverage = leverage
        this.leverageList = leverageList
        this.$refs.modal.show()
      },
      submit() {
        this.$refs.modal.close()
        this.$emit('success', this.leverage)
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep(.leverage-group) {
    .el-radio-button__inner {
      background: none;
      color: var(--app-text-color);
    }

    .el-radio-button__inner {
      background: none;
      color: var(--app-text-color);
    }

    .is-active .el-radio-button__inner {
      background: var(--el-color-primary);
      color: var(--app-text-color-white);
    }
  }
</style>

