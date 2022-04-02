<template>
  <div>
    <sidebar code="safety" />

    <div class="content">
      <el-card>
        <template #header>
          <span style="color: var(--app-text-color-light)">登录设备</span>
        </template>
        <div style="opacity: 0.9;margin-bottom: 20px;font-size: 14px;">
          登录设备：你可以删除列表中的设备，删除后在该设备登录时需要使用邮箱验证码进行登录
        </div>
        <ul class="user-device">
          <li
            v-for="userDevice in userDeviceList"
            :key="userDevice.id"
          >
            <div class="status">
              <el-tag
                v-if="userDevice.isCurrent"
                type="success"
              >
                当前设备
              </el-tag>
            </div>
            <div class="device">
              <div class="top">
                <span>
                  {{ userDevice.deviceName }} on {{ userDevice.platform }}
                </span>
                <span>
                  {{ userDevice.ip }}
                </span>
              </div>
              <div class="bottom">
                最后登录时间 {{ DateTimeUtil.format(userDevice.updateTime) }}
              </div>
            </div>
            <div class="actions">
              <el-icon>
                <delete
                  v-if="userDevice.isCurrent"
                  style="font-size: 18px;cursor: not-allowed"
                />
                <delete
                  v-else
                  @click="deleteUserDevice(userDevice.id)"
                  style="color: var(--el-color-danger);font-size: 18px;cursor: pointer"
                />
              </el-icon>
            </div>
          </li>
        </ul>
      </el-card>
      <el-card style="margin-top: 30px;">
        <template #header>
          <span style="color: var(--app-text-color-light)">安全记录</span>
        </template>
        <ul class="login-log">
          <li
            v-for="loginLog in loginLogList"
            :key="loginLog.id"
          >
            <span>
              {{ loginLog.type === 'LOGIN' ? '账户登录' : '账户登出' }}
            </span>
            <span style="text-align: center">
              IP：{{ loginLog.ip || '--' }}
            </span>
            <span style="text-align: right">
              {{ DateTimeUtil.format(loginLog.createTime) || '--' }}
            </span>
          </li>
        </ul>

        <el-pagination
          v-show="total > 10"
          style="margin: 10px 0;float:right"
          layout="prev, pager, next"
          @current-change="getLoginLog($event)"
          :total="total"
          :current-page="pageNum"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
  import Sidebar from './sidebar'
  import {Delete} from "@element-plus/icons"

  export default {
    components: {Sidebar, Delete},
    data() {
      return {
        loadingDevice: false,
        loadingLoginLog: false,
        userDeviceList: [],
        loginLogList: [],
        total: 0,
        pageNum: 1
      }
    },
    methods: {
      deleteUserDevice(id) {
        this.axios.delete('/v1/user/device?id=' + id).then(() => {
          this.$success('删除成功')
          this.getUserDevice()
        }).catch(res => {
          this.$error(res.msg)
        })
      },
      getUserDevice() {
        this.loadingDevice = true
        this.axios.get('/v1/user/device').then(data => {
          this.userDeviceList = data.records
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loadingDevice = false
        })
      },
      getLoginLog(pageNum) {
        if (!pageNum) {
          pageNum = 1
        }
        this.pageNum = pageNum
        this.loadingLoginLog = true
        this.axios.get('/v1/user/loginLog?current=' + pageNum).then(data => {
          this.loginLogList = data.records
          this.total = data.total
        }).catch(res => {
          this.$error(res.msg)
        }).finally(() => {
          this.loadingLoginLog = false
        })
      }
    },
    mounted() {
      this.getUserDevice()
      this.getLoginLog()
    }
  }
</script>

<style scoped lang="scss">
  .content {
    float: right;
    width: calc(100% - 370px);
    border: 1px solid var(--app-border-color);
    padding: 20px;

    .user-device {
      list-style: none;
      padding-left: 0;
      margin-top: 0;

      li {
        height: 74px;
        border: 1px solid var(--app-border-color);
        margin-bottom: 15px;

        .status {
          margin: 23px 0 0 25px;
          width: 100px;
        }

        .device {
          .top {
            margin-top: 15px;
            color: var(--app-text-color-light);

            span {
              margin-right: 10px;
            }
          }

          .bottom {
            font-size: 13px;
            opacity: 0.8;
            margin-top: 5px;
          }
        }

        .actions {
          float: right;
          margin-top: 28px;
          margin-right: 20px;
        }
      }

      li > div {
        float: left;
      }

    }

    .login-log {
      list-style: none;
      padding-left: 0;
      margin-top: 0;

      li {
        height: 35px;
        border-bottom: 1px solid var(--app-border-color);
        padding-top: 19px;

        span {
          display: inline-block;
          width: 33%;
        }
      }

      li:first-child {
        padding-top: 0;
      }
    }
  }
</style>
