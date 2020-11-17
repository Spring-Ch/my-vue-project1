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
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editForm(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserInf(scope.row.id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoleDialog(scope.row)"
            ></el-button>
          </template>
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
    <!-- 添加用户信息对话框区域 -->
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
    <!-- 修改用户信息对话框区域 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      ref="editUserFormRef"
      @close="editFormClose"
    >
      <!-- 修改用户信息主体区域 -->
      <el-form
        :model="editUserForm"
        :rules="editFormRules"
        ref="editUserFormRef"
        label-width="90px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码:" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClose"
    >
      <div>
        <p>当前的用户：{{ userInf.username }}</p>
        <p>当前的角色：{{ userInf.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleID" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
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
        username: '',
        password: '',
        email: '',
        mobile: '',
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
      editDialogVisible: false,
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
      // 控制分配角色对话框flag
      setRoleDialogVisible: false,
      // 分配角色列表中用户信息
      userInf: {},
      // 分配的新角色的id
      selectedRoleID: '',
      // 角色列表数据
      roleList: {},
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
          if (res.meta.status === 201) {
            this.dialogVisible = false
            return this.$message.success('添加用户信息成功'), this.getUserList()
          }
          this.$message.error('添加用户信息失败')
        }
      })
    },
    // 打开编辑对话框，并根据传入的id请求要修改的对象，并填入对话框
    async editForm(id) {
      this.editDialogVisible = !this.editDialogVisible
      const { data: res } = await this.$http.get('users/' + id)
      this.editUserForm = res.data
    },
    // 关闭对话框后，重置内容
    editFormClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 完成表单预校验，校验成功后，发送请求，更新数据库中的信息，成功后关闭对话框，并刷野页面MessageBoxdeleteUserInf
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.put(
            'users/' + this.editUserForm.id,
            {
              email: this.editUserForm.email,
              mobile: this.editUserForm.mobile,
            }
          )
          if (res.meta.status === 200) {
            this.editDialogVisible = false
            return this.$message.success('修改用户信息成功'), this.getUserList()
          }
          this.$message.error('修改用户信息失败')
        }
      })
    },
    // 点击删除按钮，弹出提醒框，确定删除后，更新数据库中的信息，并刷新页面
    async deleteUserInf(id) {
      const checkStr = await this.$confirm(
        '此操作将永久删除该用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (checkStr === 'confirm') {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status === 200) {
          this.$message.success('用户信息已删除')
          this.getUserList()
        } else {
          this.$message.error('用户信息删除失败')
        }
      } else if (checkStr === 'cancel') {
        this.$message.info('取消删除用户信息')
      }
    },
    // 为用户分配角色
    async setRoleDialog(userInf) {
      this.userInf = userInf
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 发送请求，保存用户角色信息
    async setRole() {
      if (!this.selectedRoleID) {
        return this.$message.error('请选择新角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInf.id}/role`,
        {
          rid: this.selectedRoleID,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('用户分配新角色失败')
      }
      this.$message.success('用户分配新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 对话框关闭后，重置selectedRoleID
    setRoleDialogClose() {
      this.selectedRoleID = ''
    },
  },
}
</script>
<style lang="less" scoped>
</style>