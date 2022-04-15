<template>
  <base-modal
    ref="modal"
    title="修改保证金模式"
    url="/v1/order/marginType"
    :params="params"
    :width="320"
    @success="$emit('success', this.params.marginType)"
  >
    <el-form-item
      prop="marginType"
      label="保证金模式"
      style="margin-bottom: 0 !important;"
    >
      <el-radio-group v-model="params.marginType">
        <el-radio label="CROSSED">
          全仓
        </el-radio>
        <el-radio label="ISOLATED">
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
          marginType: ''
        }
      }
    },
    methods: {
      show(marginType) {
        this.params.marginType = marginType
        this.$refs.modal.show()
      }
    }
  }
</script>

