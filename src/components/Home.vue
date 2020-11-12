<template>
  <!-- 页面主体区域 -->
  <el-container>
    <!-- 页面头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 页面左侧区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggleButton" @click="toggleButton">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单区域 -->
            <el-menu-item
              :index="'/' + subItem.path"
              @click="getPath('/' + subItem.path)"
              :key="subItem.id"
              v-for="subItem in item.children"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      // 创建一个字体图标对象，保存不同Item对应的图标
      iconList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 控制侧边栏折叠的flag
      isCollapse: false,
      // 当前选中项路径
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登录界面
      this.$router.push('/login')
    },
    // 获取左侧列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 控制左侧菜单栏展开折叠
    toggleButton() {
      this.isCollapse = !this.isCollapse
    },
    // 根据点击获得当前获得项
    getPath(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 20px;
    img {
      width: 60px;
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.toggleButton {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  font-size: 12px;
  line-height: 28px;
  cursor: pointer;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>