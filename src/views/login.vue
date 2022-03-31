<template>
  <div>
    <div class="left">
      CFD
    </div>
    <el-card class="right">
      <template #header>
        <a
          :class="'login-type ' + (params.type === 'BY_CODE' ? 'active' : '')"
          @click="changeType('BY_CODE')"
        >
          验证码登录
        </a>
        |
        <a
          :class="'login-type ' + (params.type === 'BY_PWD' ? 'active' : '')"
          @click="changeType('BY_PWD')"
        >
          密码登录
        </a>
      </template>
      <el-form
        ref="form"
        :model="params"
        :rules="rules"
      >
        <el-form-item prop="email">
          <el-input
            placeholder="请输入邮箱"
            v-model="params.email"
            @keyup.enter.native="submit"
            autocomplete="off"
          >
            <template #prepend>
              <el-icon>
                <message />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="loginPwd"
          v-if="params.type === 'BY_PWD'"
        >
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="params.loginPwd"
            @keyup.enter.native="submit"
            autocomplete="off"
          >
            <template #prepend>
              <el-icon>
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="verifyCode"
          v-else
        >
          <el-input
            placeholder="请输入验证码"
            v-model="params.verifyCode"
            @keyup.enter.native="submit"
            autocomplete="off"
          >
            <template #prepend>
              <el-icon>
                <circle-check />
              </el-icon>
            </template>
            <template #append>
              <a
                @click="sendCode"
                v-loading="loading"
                style="color: var(--app-text-color);cursor: pointer"
              >
                {{ codeText }}
              </a>
            </template>
          </el-input>
        </el-form-item>
        <el-button
          type="primary"
          size="medium"
          @click="submit"
          v-loading="loading"
          style="margin-bottom: 10px;"
        >
          登 录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import Md5 from 'js-md5'
  import {Message, CircleCheck, Lock} from "@element-plus/icons"

  export default {
    components: {Message, CircleCheck, Lock},
    data() {
      return {
        loading: false,
        codeText: '获取验证码',
        second: 60,
        params: {
          type: 'BY_CODE',
          email: (JSON.parse(localStorage.getItem('userInfo')) || {}).email,
          loginPwd: '',
          verifyCode: ''
        },
        rules: {
          email: [
            {required: true, message: '邮箱为必填项'}
          ],
          loginPwd: [
            {required: true, message: '密码为必填项'}
          ],
          verifyCode: [
            {required: true, message: '验证码为必填项'}
          ]
        }
      }
    },
    methods: {
      changeType(type) {
        this.params.type = type
      },
      sendCode() {
        if (this.second !== 60 || this.loading || this.codeText !== '获取验证码') {
          return
        }
        let that = this;
        this.$refs.form.validateField('email', function (errMsg) {
          if (errMsg) {
            return
          }
          that.loading = true
          that.codeText = '发送中...'
          that.axios.post('/v1/email/send', {
            type: 'LOGIN',
            email: that.params.email
          }).then(() => {
            that.startTimer()
            that.$success('发送成功')
          }).catch(res => {
            that.codeText = '获取验证码'
            that.$error(res.msg)
          }).finally(() => {
            that.loading = false
          })
        });
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
      submit: function () {
        if (this.loading) {
          return
        }
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return
          }
          this.loading = true;
          let params = Object.assign({}, this.params)
          if (this.params.type === 'BY_PWD') {
            params.verifyCode = undefined
            params.loginPwd = Md5(params.loginPwd)
          }
          this.axios.post('/v1/user/login', params).then(data => {
            this.$store.commit('setUserInfo', data)
            this.params.loginPwd = ''
            this.params.verifyCode = ''
            this.$router.push({
              path: '/'
            })
          }).catch(res => {
            this.$error(res.msg)
          }).finally(() => {
            this.loading = false
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .left {
    float: left;
    width: 50%;
    font-size: 150px;
    font-weight: bold;
    font-style: italic;
    color: var(--el-color-primary);
    text-align: center;
    padding-top: 160px;
  }

  .right {
    float: right;
    width: 380px;
    margin-top: 120px;
    margin-right: 50px;

    .login-type {
      font-size: 18px;
      margin: 0 10px;
      cursor: pointer;
    }

    .active {
      color: var(--app-text-color-white);
    }

    .el-form-item {
      margin-top: 12px;
      margin-bottom: 35px;
    }

    .el-button {
      margin-top: 5px;
      width: 100%;
      font-size: 16px;
      border-radius: 20px;

      span {
        color: var(--app-text-color-dark);
      }
    }
  }
</style>
