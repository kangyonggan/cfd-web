<template>
  <div>
    <sidebar code="account" />

    <div class="content">
      <div class="item">
        <div class="left-icon">
          <el-icon>
            <circle-check style="font-size: 40px;color: var(--el-color-success)" />
          </el-icon>
        </div>
        <div>
          <div class="title">
            邮箱
          </div>
          <div class="desc">
            {{ profile.email || '--' }}
          </div>
        </div>
        <div class="actions">
          <span style="cursor: not-allowed;color: var(--app-text-color-dark)">
            换绑
          </span>
        </div>
      </div>
      <div class="item">
        <div class="left-icon">
          <el-icon>
            <circle-check
              v-if="profile.hasLoginPwd"
              style="font-size: 40px;color: var(--el-color-success)"
            />
            <circle-close
              v-else
              style="font-size: 40px;color: var(--el-color-danger)"
            />
          </el-icon>
        </div>
        <div>
          <div class="title">
            登录密码
          </div>
          <div class="desc">
            <span v-if="profile.hasLoginPwd">已设置，</span><span v-else>未设置，设置后</span>可通过邮箱+登录密码进行登录
          </div>
        </div>
        <div class="actions">
          <span
            v-if="profile.hasLoginPwd"
            @click="setPwd('LOGIN_PWD')"
          >
            更改
          </span>
          <span
            v-else
            @click="setPwd('LOGIN_PWD')"
          >
            设置
          </span>
        </div>
      </div>
      <div class="item">
        <div class="left-icon">
          <el-icon>
            <circle-check
              v-if="profile.hasPayPwd"
              style="font-size: 40px;color: var(--el-color-success)"
            />
            <circle-close
              v-else
              style="font-size: 40px;color: var(--el-color-danger)"
            />
          </el-icon>
        </div>
        <div>
          <div class="title">
            支付密码
          </div>
          <div class="desc">
            <span v-if="profile.hasPayPwd">已设置，提币时需要进行支付密码验证</span>
            <span v-else>未设置，不能进行提币</span>
          </div>
        </div>
        <div class="actions">
          <span
            v-if="profile.hasPayPwd"
            @click="setPwd('PAY_PWD')"
          >
            更改
          </span>
          <span
            v-else
            @click="setPwd('PAY_PWD')"
          >
            设置
          </span>
        </div>
      </div>
      <div class="item">
        <div class="left-icon">
          <el-icon>
            <circle-check
              v-if="profile.hasGoogleSecretKey"
              style="font-size: 40px;color: var(--el-color-success)"
            />
            <circle-close
              v-else
              style="font-size: 40px;color: var(--el-color-danger)"
            />
          </el-icon>
        </div>
        <div>
          <div class="title">
            谷歌验证
          </div>
          <div class="desc">
            <span v-if="profile.hasGoogleSecretKey">已设置，大额提币时需要进行谷歌验证</span>
            <span v-else>未设置，无法进行大额提币</span>
          </div>
        </div>
        <div class="actions">
          <span
            v-if="profile.hasGoogleSecretKey"
            @click="setGoogleSecretKey"
          >
            更改
          </span>
          <span
            v-else
            @click="setGoogleSecretKey"
          >
            设置
          </span>
        </div>
      </div>
    </div>

    <password-modal
      ref="password-modal"
      @success="success"
    />

    <google-secret-modal
      ref="google-secret-modal"
      @success="success"
    />
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import {CircleCheck, CircleClose} from "@element-plus/icons"
  import PasswordModal from './pasword-modal'
  import GoogleSecretModal from './google-secret-modal'

  export default {
    components: {Sidebar, CircleCheck, CircleClose, PasswordModal, GoogleSecretModal},
    data() {
      return {
        profile: {}
      }
    },
    methods: {
      success(data) {
        this.$store.commit('setUserInfo', data)
        this.profile = data
        this.$success('设置成功')
      },
      getProfile() {
        this.axios.get('/v1/user/profile').then(data => {
          this.$store.commit('setUserInfo', data)
          this.profile = data
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      setPwd(type) {
        this.$refs['password-modal'].show(this.profile, type)
      },
      setGoogleSecretKey() {
        this.$refs['google-secret-modal'].show(this.profile)
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
    width: calc(100% - 330px);

    .item > div {
      float: left;
      margin-top: 12px;
    }

    .item {
      height: 76px;
      border: 1px solid var(--app-border-color);
      padding: 10px 20px;
      margin-bottom: 20px;

      .left-icon {
        width: 70px;
        margin-top: 18px;
        margin-left: 16px;
      }

      .title {
        font-size: 18px;
        color: var(--app-text-color-white);
      }

      .desc {
        margin-top: 5px;
        color: var(--app-text-color-dark);
        font-size: 13px;
      }

      .actions {
        float: right;
        margin-top: 30px;

        span {
          cursor: pointer;
        }

        span:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
</style>
