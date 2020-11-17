<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 卡片头区域 -->
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addRoleDialog"
              >添加角色</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdBottom', i1 === 0 ? 'bdTop' : '', 'vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="rightClose(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdTop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="rightClose(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="rightClose(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色信息对话框区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addRoleFormClose"
    >
      <!-- 添加用户信息主体区域 -->
      <el-form
        :model="addRoleForm"
        :rules="roleFormRules"
        ref="addRoleFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息对话框区域 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editRoleFormClose"
    >
      <!-- 添加用户信息主体区域 -->
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRoleFormRef"
        label-width="90px"
      >
        <el-form-item label="角色ID:" prop="roleId">
          <el-input v-model="editRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="30%"
      @close="setRightDialogClose"
      ><el-tree
        :data="treeList"
        :props="treeProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="treeKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allorRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表数据
      roleList: [],
      // 控制添加角色信息对话框出现flag
      addDialogVisible: false,
      // 控制编辑角色信息对话框出现flag
      editDialogVisible: false,
      // 添加角色信息对象
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 修改角色信息对象
      editRoleForm: {
        roleId: 0,
        roleName: '',
        roleDesc: '',
      },
      // 添加角色信息校验规则
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      // 编辑角色信息校验规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
      },
      // 控制分配权限对话框出现flag
      setRightDialogVisible: false,
      // 分配权限数据列表
      treeList: {},
      // 树形控件属性定义
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      // 默认勾选的的节点的数组
      treeKeys: [],
      // 分配权限函数中选中的角色Id
      roleID: 0,
    }
  },
  methods: {
    // 发送请求，获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      this.roleList = res.data
    },
    // 打开添加角色信息对话框
    addRoleDialog() {
      this.addDialogVisible = !this.addDialogVisible
    },
    async editRoleDialog(id) {
      this.editDialogVisible = !this.editDialogVisible
      const { data: res } = await this.$http.get('roles/' + id)
      this.editRoleForm = res.data
    },
    // 关闭对话框后，重置其内容和校验结果
    addRoleFormClose() {
      this.$refs.addRoleFormRef.resetFields()
    },
    editRoleFormClose() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 发送添加角色信息请求
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色信息失败')
        }
        this.$message.success('添加角色信息成功')
        this.getRoleList()
        this.addDialogVisible = false
      })
    },
    // 根据ID，发送角色信息请求
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          this.editRoleForm
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        this.$message.success('编辑角色信息成功')
        this.getRoleList()
        this.editDialogVisible = false
      })
    },
    // 根据id，删除对应的角色信息
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色信息失败')
      }
      this.$message.success('删除角色信息成功')
      this.getRoleList()
    },
    // 删除角色指定权限
    async rightClose(role, itemID) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${itemID}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色权限失败')
      }
      this.$message.success('删除角色权限成功')
      // 避免刷新页面，直接将请求结果赋值给role
      role.children = res.data
    },
    // 分配权限对话框
    async setRightDialog(role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色权限列表信息失败')
      }
      this.treeList = res.data
      this.getTreeList(role, this.treeKeys)
      this.roleID = role.id
      this.setRightDialogVisible = true
    },
    // 获取当前角色的权限列表
    getTreeList(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach((item) => {
        this.getTreeList(item, arr)
      })
    },
    // 关闭分配权限对话框时，重置treeKeys数组
    setRightDialogClose() {
      this.treeKeys = []
    },
    // 发送请求，给角色分配权限
    async allorRights() {
      const keyArr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const keyStr = keyArr.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleID}/rights`,
        {
          rids: keyStr,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('角色添加权限失败')
      }
      this.$message.success('角色添加权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    },
  },
  created() {
    this.getRoleList()
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdTop {
  border-top: 1px solid #eee;
}
.bdBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>