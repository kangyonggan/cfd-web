<template>
  <span>
    <el-icon
      style="cursor: pointer;margin-left: 5px;"
      @click="copy"
    >
      <document-copy />
    </el-icon>
    <input
      style="position: absolute;left: -99999px;top:0;"
      :id="id"
      :value="value"
    >
  </span>
</template>

<script>
import {DocumentCopy} from '@element-plus/icons'
export default {
  components: {DocumentCopy},
  props: {
    value: {
      required: true,
      type: [String, Number]
    }
  },
  data() {
    return {
      id: this.NumberUtil.randomDeviceId(128)
    }
  },
  methods: {
    /**
     * 复制
     */
    copy() {
      const target = document.getElementById(this.id)
      target.select()
      document.execCommand("copy")
      this.$success('复制成功')
    },
  },
}
</script>
