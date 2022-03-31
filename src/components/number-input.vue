<template>
  <el-input
    :model-value="modelValue"
    @input="input"
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
    modelValue:{
      required: true,
      type: [String, Number]
    },
    precision: {
      required: false,
      type: Number,
      default: 0
    },
    maxLength: {
      required: false,
      type: Number,
      default: -1
    },
    placeholder: {
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
      val = this.NumberUtil.toNumber(val, this.precision)
      if (this.maxLength > 0 && val.toString().length > this.maxLength) {
        val = val.toString().substring(0, this.maxLength) * 1
      }
      this.$emit('update:modelValue', val)
    },
  }
}
</script>
