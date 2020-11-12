<template>
  <div class="usersContainer">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card class="box-card">
      <!-- 卡片头区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-input
              placeholder="请输入内容"
              v-model="paramsInf.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              >
              </el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogForm">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 用户列表数据区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-setting"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInf.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="paramsInf.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="userFormClose"
    >
      <!-- 添加用户信息主体区域 -->
      <el-form
        :model="addUserForm"
        :rules="userFormRules"
        ref="addUserFormRef"
        label-width="90px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addUserForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱地址
    var checkEmail = (rule, value, cb) => {
      const regEamil = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEamil.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的邮箱地址'))
    }
    // 验证手机号码
    var checkPhone = (rule, value, cb) => {
      const regPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (regPhone.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确格式的手机号码'))
    }
    return {
      // get请求参数
      paramsInf: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      // 获取用户列表数据
      userList: [],
      // 当前数据总数
      total: 0,
      // 控制添加用户信息对话框出现
      dialogVisible: false,
      // 添加用户信息表单
      addUserForm: {
        username: 'asd',
        password: '123456',
        email: 'asdf@qq.com',
        mobile: '13833028094',
      },
      // 表单验证规则
      userFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 发送请求，获取用户数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.paramsInf,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据列表失败')
      }
      this.$message.success('获取用户数据列表成功')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 控制页面显示内容大小
    handleSizeChange(newSize) {
      this.paramsInf.pagesize = newSize
      this.getUserList()
    },
    // 控制页面切换
    handleCurrentChange(newPage) {
      this.paramsInf.pagenum = newPage
      this.getUserList()
    },
    // 用户状态切换
    async stateChange(userInf) {
      const { data: res } = await this.$http.put(
        `users/${userInf.id}/state/${userInf.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户状态失败')
        // 用户状态更新失败后，将页面重置为之前的状态
        userInf.mg_state = !userInf.mg_state
      }
      this.$message.success('更新用户状态成功')
    },
    // 搜索对应用户名的用户信息
    dialogForm() {
      this.dialogVisible = !this.dialogVisible
    },
    // 用户信息对话框关闭后，重置里面的内容
    userFormClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 表单预校验，校验成功后，发送请求，添加用户信息，并刷新列表
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('users', this.addUserForm)
          this.dialogVisible = false
          if (res.meta.status === 201) {
            return this.$message.success('添加用户信息成功'), this.getUserList()
          }
          this.$message.error('添加用户信息失败')
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
</style>