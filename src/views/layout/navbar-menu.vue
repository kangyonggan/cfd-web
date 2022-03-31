<template>
  <el-menu-item
    v-if="!menu.childrens || !menu.childrens.length"
    :index="menu.path"
    v-show="!menu.hidden"
  >
    {{ menu.name }}
  </el-menu-item>
  <el-sub-menu
    v-else
    :index="menu.path"
  >
    <template #title>
      {{ menu.name }}
    </template>
    <el-menu-item
      v-for="subMenu in menu.childrens"
      :key="subMenu.path"
      :index="subMenu.path"
    >
      {{ subMenu.name }}
    </el-menu-item>
  </el-sub-menu>
</template>

<script>
export default {
  props: {
    menu: {
      required: true,
      type: Object
    }
  }
}
</script>
