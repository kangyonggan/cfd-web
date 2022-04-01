<template>
  <div>
    <sidebar code="profile" />

    <div class="content">
      <el-form
        ref="form"
        label-position="top"
        :model="params"
        :rules="rules"
      >
        <el-form-item
          label="昵称"
          prop="nickName"
        >
          <el-input
            v-model="params.nickName"
            placeholder="请输入昵称"
            clearable
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item
          label="标签"
          prop="tags"
        >
          <el-select
            v-model="selectedTags"
            multiple
            :multiple-limit="3"
            placeholder="请选择标签"
            style="width: 100%"
            @change="changeTags"
          >
            <el-option
              v-for="tag in tags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="头像"
          prop="avatar"
        >
          <el-upload
            drag
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
          >
            <img
              alt="avatar"
              v-if="params.avatar"
              :src="params.avatar"
              class="avatar"
            >
            <el-icon
              v-else
              class="el-icon--upload"
            >
              <upload-filled />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="loading"
            @click="submit"
          >
            更新信息
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import {UploadFilled} from "@element-plus/icons"

  export default {
    components: {Sidebar, UploadFilled},
    data() {
      return {
        loading: false,
        params: {
          nickName: '',
          tags: '',
          avatar: ''
        },
        rules: {
          nickName: [
            {required: true, message: '请输入昵称'}
          ]
        },
        tags: ['重仓', '轻仓', '高风险', '稳健', '激进', '主流', '高频', '低频', '短线', '中线', '长线'],
        selectedTags: [],
        imgTypes: [
          'image/gif',
          'image/jpeg',
          'image/bmp',
          'image/png',
          'image/webp'
        ],
        size: 2
      }
    },
    methods: {
      changeTags(tags) {
        this.params.tags = tags.join()
      },
      beforeUpload(file) {
        if (!this.imgTypes.includes(file.type)) {
          this.$error('只能选择 gif/jpg/jpeg/bmp/png/webp 格式的图片!')
          return false;
        }
        if (file.size / 1024 / 1024 > this.size) {
          this.$error('图片大小不能超过 ' + this.size + 'MB!')
          return false
        }

        return true
      },
      uploadSuccess(res) {
        console.log(res)
        if (!res.success) {
          this.$error(res.msg)
          return
        }

        this.params.avatar = res.data
      },
      getProfile() {
        this.loading = true;
        this.axios.get('/v1/user/profile').then(data => {
          this.$store.commit('setUserInfo', data)
          this.params.nickName = data.nickName
          this.params.tags = data.tags
          if (data.tags) {
            this.selectedTags = data.tags.split(',')
          }
          this.params.avatar = data.avatar
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return
          }
          this.loading = true;
          let params = Object.assign({}, this.params)
          this.axios.post('/v1/user/profile', params).then(data => {
            this.$store.commit('setUserInfo', data)
            this.$success('更新成功')
          }).catch(res => {
            this.$error(res.msg)
          }).finally(() => {
            this.loading = false
          })
        })
      }
    },
    mounted() {
      this.getProfile()
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 370px);
    border: 1px solid var(--app-border-color);
    padding: 20px;
  }
</style>
