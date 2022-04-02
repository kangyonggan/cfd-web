<template>
  <base-modal
    ref="modal"
    :title="title"
    :auto-submit="false"
    :before-submit="submit"
    url="/v1/user/password"
    :params="params"
    :rules="rules"
    @success="$emit('success', $event)"
    :width="500"
  >
    <el-form-item
      v-if="(params.type === 'LOGIN_PWD' && profile.hasLoginPwd) || (params.type === 'PAY_PWD' && profile.hasPayPwd)"
      prop="verifyCode"
      label="邮箱验证码"
    >
      <el-input
        placeholder="请输入验证码"
        v-model="params.verifyCode"
        @keyup.enter.native="submit"
        autocomplete="off"
        style="width: 90%"
      >
        <template #append>
          <a
            @click="sendCode"
            style="cursor: pointer"
          >
            {{ codeText }}
          </a>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="password"
      :label="params.type === 'LOGIN_PWD' ? '登录密码' : '支付密码'"
    >
      <el-input
        type="password"
        show-password
        v-model="params.password"
        :placeholder="params.type === 'LOGIN_PWD' ? '请输入登录密码' : '请输入支付密码'"
        style="width: 90%"
        autocomplete="off"
      />
    </el-form-item>
  </base-modal>
</template>

<script>
  import Md5 from 'js-md5'
  import BaseModal from '@/components/base-modal.vue'

  export default {
    emits: ['success'],
    components: {BaseModal},
    data() {
      return {
        loading: false,
        title: '',
        codeText: '获取验证码',
        second: 60,
        params: {
          verifyCode: '',
          password: '',
          type: ''
        },
        rules: {
          verifyCode: [
            {required: true, message: '请输入邮箱验证码'}
          ],
          password: [
            {required: true, message: '请输入密码'}
          ],
        },
        profile: {}
      }
    },
    methods: {
      submit() {
        let params = Object.assign({}, this.params)
        params.password = Md5(params.password)
        this.$refs.modal.submit(params)
      },
      show(profile, type) {
        this.profile = profile
        this.params.type = type
        this.params.password = ''
        this.params.verifyCode = ''

        if (type === 'LOGIN_PWD') {
          if (this.profile.hasLoginPwd) {
            this.title = '修改登录密码'
          } else {
            this.title = '设置登录密码'
          }
        } else if (type === 'PAY_PWD') {
          if (this.profile.hasPayPwd) {
            this.title = '修改支付密码'
          } else {
            this.title = '设置支付密码'
          }
        }
        this.$refs.modal.show()
      },
      sendCode() {
        if (this.second !== 60 || this.loading || this.codeText !== '获取验证码') {
          return
        }
        this.loading = true
        this.codeText = '发送中...'
        this.axios.post('/v1/email/send', {
          type: 'RESET_' + this.params.type,
          email: this.$store.getters.getUserInfo.email
        }).then(() => {
          this.startTimer()
          this.$success('发送成功')
        }).catch(res => {
          this.codeText = '获取验证码'
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      startTimer(sec) {
        if (sec) {
          this.second = sec
        }
        const timer = setInterval(() => {
          this.codeText = this.second + 's'
          this.second--
          if (this.second === 0) {
            this.second = 60
            this.codeText = '获取验证码'
            clearInterval(timer)
          }
        }, 1000)
      },
    }
  }
</script>

