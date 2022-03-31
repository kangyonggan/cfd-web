<template>
  <el-dialog
    custom-class="base-dialog"
    :title="title"
    :width="width"
    v-model="dialogVisible"
    :close-on-click-modal="submitDisabled"
    :close-on-press-escape="submitDisabled"
    :before-close="close"
    :lock-scroll="false"
  >
    <el-form
      v-loading="loading"
      ref="form"
      :label-width="labelWidth + 'px'"
      :model="params"
      :rules="rules"
    >
      <slot />
    </el-form>
    <template #footer>
      <el-button
        @click="close"
      >
        关 闭
      </el-button>
      <el-button
        v-if="!submitDisabled"
        type="primary"
        :disabled="loading"
        @click="doSubmit"
      >
        {{ submitText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  emits: ['success', 'failure', 'close'],
  props: {
    title: {
      required: true,
      type: String
    },
    baseUrl: {
      required: false,
      type: String,
      default: ''
    },
    url: {
      required: false,
      type: String,
      default: ''
    },
    params: {
      required: false,
      type: Object,
      default: function () {
        return {}
      }
    },
    rules: {
      required: false,
      type: Object,
      default: function () {
        return {};
      }
    },
    width: {
      required: false,
      type: Number,
      default: 550
    },
    labelWidth: {
      required: false,
      type: Number,
      default: 95
    },
    submitText: {
      required: false,
      type: String,
      default: '提 交'
    },
    submitDisabled: {
      required: false,
      type: Boolean,
      default: false
    },
    autoSubmit: {
      required: false,
      type: Boolean,
      default: true
    },
    beforeSubmit: {
      required: false,
      type: Function,
      default: function () {

      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false
    }
  },
  methods: {
    show: function () {
      this.dialogVisible = true
      this.$nextTick(function () {
        this.$refs.form.clearValidate()
      })
    },
    close() {
      this.$refs.form.clearValidate()
      this.dialogVisible = false
      this.$emit('close')
    },
    validateField(prop, callback) {
      this.$refs.form.validateField(prop, callback);
    },
    validateFields(props, callback) {
      let success = true
      for (let i = 0; i < props.length; i++) {
        this.$refs.form.validateField(props[i], function (e) {
          if (e) {
            success = false
          }
        })
      }
      if (success) {
        callback()
      }
    },
    doSubmit: function () {
      if (this.submitDisabled) {
        this.close()
        return
      }
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return
        }

        this.beforeSubmit()

        if (!this.autoSubmit) {
          return
        }

        this.submit()
      })
    },
    submit(params) {
      if (!params) {
        params = this.params
      }
      this.loading = true
      let config = {}
      if (this.baseUrl) {
        config.baseURL = this.baseUrl
      }
      this.axios.post(this.url, params, config).then(data => {
        this.close()
        this.$emit('success', data)
      }).catch(res => {
        this.$error(res.msg)
        this.$emit('failure', res)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.base-dialog {
  background: var(--app-text-color-light) !important;

  .el-dialog__header {
    border-bottom: 1px solid var(--app-border-color);
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__title {
    color: var(--app-text-color-light);
  }

  .el-input {
    .el-input__inner {
      background: none;
    }
  }
}
</style>
