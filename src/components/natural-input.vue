<template>
  <el-input
    :size="size"
    :model-value="modelValue"
    @input="input"
    autocomplete="off"
    :placeholder="placeholder"
    :readonly="readonly"
    :clearable="!readonly"
  >
    <template
      #append
      v-if="append"
    >
      <slot name="append" />
    </template>
  </el-input>
</template>

<script>
  export default {
    props: {
      modelValue: {
        required: false,
        type: [String, Number],
        default: ''
      },
      precision: {
        required: false,
        type: Number,
        default: 0
      },
      placeholder: {
        required: false,
        type: String,
        default: ''
      },
      size: {
        required: false,
        type: String,
        default: ''
      },
      append: {
        required: false,
        type: Boolean,
        default: false
      },
      readonly: {
        required: false,
        type: Boolean,
        default: false
      }
    },
    methods: {
      input(val) {
        if (val === '') {
          this.$emit('update:modelValue', val)
          return
        }
        this.$emit('update:modelValue', this.NumberUtil.toNumber(val, this.precision))
      },
    }
  }
</script>
