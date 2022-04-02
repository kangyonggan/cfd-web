<template>
  <base-modal
    ref="modal"
    title="谷歌认证"
    url="/v1/user/googleSecretKey"
    :params="params"
    :rules="rules"
    @success="$emit('success', $event)"
    :width="500"
  >
    <el-form-item
      label="谷歌密钥"
      style="margin-bottom: 0;"
    >
      <el-input
        readonly
        v-model="googleSecretKey"
        style="width: 90%"
      >
        <template #append>
          <base-copy :value="googleSecretKey" />
        </template>
      </el-input>
    </el-form-item>

    <div
      id="qrcode"
      style="margin: 0 auto;width: 150px;"
    />

    <el-form-item
      prop="verifyCode"
      label="邮箱验证码"
    >
      <el-input
        placeholder="请输入验证码"
        v-model="params.verifyCode"
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
      prop="googleCode"
      label="谷歌验证码"
    >
      <el-input
        v-model="params.googleCode"
        placeholder="请输入谷歌验证码"
        style="width: 90%"
        autocomplete="off"
      />
    </el-form-item>
  </base-modal>
</template>

<script>
  import BaseModal from '@/components/base-modal.vue'
  import {qrcanvas} from "qrcanvas"
  import BaseCopy from "../../components/base-copy"

  export default {
    emits: ['success'],
    components: {BaseCopy, BaseModal},
    data() {
      return {
        loading: false,
        codeText: '获取验证码',
        second: 60,
        params: {
          verifyCode: '',
          googleCode: ''
        },
        rules: {
          verifyCode: [
            {required: true, message: '请输入邮箱验证码'}
          ],
          googleCode: [
            {required: true, message: '请输入谷歌验证码'}
          ],
        },
        profile: {},
        googleSecretKey: ''
      }
    },
    methods: {
      show(profile) {
        this.profile = profile
        this.params.verifyCode = ''
        this.params.googleCode = ''
        this.getGoogleSecretCode()

        this.$refs.modal.show()
      },
      getGoogleSecretCode() {
        this.loading = true
        this.axios.get('/v1/user/googleSecretKey').then(data => {
          this.googleSecretKey = data
          this.generateQrCode()
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loading = false
        })
      },
      generateQrCode() {
        let text = 'otpauth://totp/' + this.$store.getters.getUserInfo.email + '?secret=' + this.googleSecretKey + '&issuer=CFD'
        let qr = qrcanvas({
          data: text,
          size: 150,
          padding: 5
        })
        document.getElementById('qrcode').innerHTML = ''
        qr.style.padding = '6px'
        document.getElementById('qrcode').appendChild(qr)
      },
      sendCode() {
        if (this.second !== 60 || this.loading || this.codeText !== '获取验证码') {
          return
        }
        this.loading = true
        this.codeText = '发送中...'
        this.axios.post('/v1/email/send', {
          type: 'GOOGLE_SECRET_KEY',
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

