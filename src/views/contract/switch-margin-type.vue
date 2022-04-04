<template>
  <base-modal
    ref="modal"
    title="修改保证金模式"
    url="/v1/contract/order/switchMode"
    :params="params"
    :width="320"
    @success="$emit('success', this.params.mode)"
  >
    <el-form-item
      prop="mode"
      label="保证金模式"
      style="margin-bottom: 0 !important;"
    >
      <el-radio-group v-model="params.mode">
        <el-radio label="FULL">
          全仓
        </el-radio>
        <el-radio label="SINGLE">
          逐仓
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'

  export default {
    emits: ['success'],
    components: {BaseModal},
    data() {
      return {
        params: {
          mode: ''
        }
      }
    },
    methods: {
      show(marginType) {
        this.params.mode = marginType
        this.$refs.modal.show()
      }
    }
  }
</script>

