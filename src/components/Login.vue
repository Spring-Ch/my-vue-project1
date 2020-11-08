<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="login_logo">
        <img src="../assets/logo.png" />
      </div>
      <!-- 登录框区域 -->
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 数据验证规则
      loginFormRules: {
        // 用户名验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 密码验证规则
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
    login() {
      // 验证通过后发生axios请求，根据状态码弹出对应的消息框
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const { data: res } = await this.$http.post("login", this.loginForm);
          if (res.meta.status == 200) {
            this.$message.success("登录成功");
            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
            // 1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
            window.sessionStorage.setItem("token", res.data.token);
            // 登录成功后，通过编程时导航，自动跳转到Home页面
            this.$router.push("/home");
          } else {
            this.$message.error("登录失败");
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_logo {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 0 10px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>