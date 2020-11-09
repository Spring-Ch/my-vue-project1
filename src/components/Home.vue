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
      <el-aside width="200px">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体内容区域 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear();
      // 跳转到登录界面
      this.$router.push("/login");
    },
  },
};
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
}
.el-main {
  background-color: #eaedf1;
}
</style>