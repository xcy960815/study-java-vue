<template>
  <el-container class="layout-container">
    <el-aside
      id="sidebarContainer"
      class="layout-menu"
      :class="{ 'layout-menu-collapse': isCollapse }"
      :width="isCollapse ? '64px' : '300px'"
    >
      <layout-menu></layout-menu>
      <!-- 给个可以拖拽的标识 -->
      <div id="drap-meuline" class="drap-meuline"></div>
    </el-aside>
    <el-container class="layout-view-container">
      <layoout-header></layoout-header>
      <el-main class="layout-main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import LayooutHeader from './header/index.vue'
import LayoutMenu from './menu/index.vue'
import { useSystemInfoStore } from '@store'
const systemInfoStore = useSystemInfoStore()

const isCollapse = computed(() => {
  const isCollapse = !systemInfoStore.openMenuFlag
  console.log('isCollapse---isCollapse', isCollapse)
  return isCollapse
})

/**
 * 初始化左侧菜单宽度
 */
const initLeftMenuWidth = () => {
  const sidebarContainer = document.getElementById(
    'sidebarContainer'
  )!
  const history_width =
    localStorage.getItem('sliderWidth') || '300px'
  if (!isCollapse.value) {
    sidebarContainer.style.width = history_width
  } else {
    sidebarContainer.style.width = '64px'
  }
}

onMounted(() => {
  initLeftMenuWidth()
  // 获取dom，对左菜单进行拖拽
  const drapLine = document.getElementById('drap-meuline')!

  drapLine.onmousedown = (e) => {
    e.preventDefault() // 阻止默认事件
    // 设置最大/最小宽度
    const max_width = 600
    const min_width = 54
    let mouse_x = 0 // 记录鼠标相对left盒子x轴位置
    const _e = e || window.event
    // mouse_x = _e.clientX - sidebarContainer.offsetWidth;
    document.onmousemove = (e_) => {
      //     const _e_ = e_ || window.event;
      //     let left_width = _e_.clientX - mouse_x;
      //     left_width = left_width < min_width ? min_width : left_width;
      //     left_width = left_width > max_width ? max_width : left_width;
      //     if (this.$store.state.app.sidebar.opened) {
      //       sidebarContainer.style.width = left_width + "px";
      //     }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      //     // 本地保存
      //     localStorage.setItem("sliderWidth", sidebarContainer.style.width);
      //     if (parseInt(sidebarContainer.style.width) <= parseInt("54px")) {
      //       this.$store.dispatch('app/closeSideBar', { withoutAnimation: true })
      //     }
    }
  }
})
</script>
<style lang="less" scoped>
.layout-container {
  height: 100%;
  width: 100%;
  display: flex;

  .layout-menu {
    height: 100%;
    background-color: rgb(2, 93, 126);
    transition: width 0.3s;
    display: flex;

    .drap-meuline {
      background: transparent;
      width: 4px;
      cursor: e-resize; // 设置鼠标悬浮上去显示可拖拽样式
    }
  }

  .layout-view-container {
    display: flex;
    flex-direction: column;

    .layout-main-container {
      flex: 1;
      padding: 10px;
    }
  }
}
</style>
