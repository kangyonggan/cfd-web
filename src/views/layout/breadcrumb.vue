<template>
  <el-breadcrumb>
    <el-breadcrumb-item to="/">
      首页
    </el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="b in breadcrumbs"
      :key="b.path"
      :to="b.path"
    >
      {{ b.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import Menus from './menus'

  export default {
    data() {
      return {
        path: '',
        breadcrumbs: []
      }
    },
    methods: {
      updateBreadcrumbsAndTitle(path) {
        if ('/' === path) {
          document.title = '首页 - CFD'
          return []
        }
        this.breadcrumbs = this.getMenuByPath(path, Menus)
        let title = ''
        for (let i = this.breadcrumbs.length - 1; i >= 0; i--) {
          if (i < this.breadcrumbs.length - 1) {
            title += ' - '
          }
          title += this.breadcrumbs[i].name
        }
        if (!title) {
          this.breadcrumbs.push({
            path: '/404',
            name: '404',
          })
          title = '404'
        }
        document.title = title + ' - CFD'
      },
      getMenuByPath(path, menus) {
        let res = []
        for (let i = 0; i < menus.length; i++) {
          res.push(menus[i])
          if (menus[i].path === path) {
            return res
          } else if (!menus[i].childrens || !menus[i].childrens.length) {
            res.pop()
          } else {
            let childrenRes = this.getMenuByPath(path, menus[i].childrens)
            if (childrenRes && childrenRes.length) {
              Array.prototype.push.apply(res, childrenRes)
            } else {
              res.pop()
            }
          }
        }

        return res
      }
    },
    mounted() {
      this.path = this.$route.path
      this.updateBreadcrumbsAndTitle(this.path)
    },
    watch: {
      '$route'(newRoute) {
        this.path = newRoute.path
        this.updateBreadcrumbsAndTitle(this.path)
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-breadcrumb {
    height: 34px;
  }
</style>
