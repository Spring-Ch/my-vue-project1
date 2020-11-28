<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告信息区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <el-row class="opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <!-- 动态参数页面 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数
          </el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTable" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性页面 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性
          </el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTable" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 动态编辑标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + textContent"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addAttrFromRef"
        :model="attrFrom"
        label-width="80px"
        :rules="attrFromRules"
      >
        <el-form-item :label="textContent" prop="attr_name">
          <el-input v-model="attrFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'编辑' + textContent"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editAttrFromRef"
        :model="editrFrom"
        label-width="80px"
        :rules="editFromRules"
      >
        <el-form-item :label="textContent" prop="attr_name">
          <el-input v-model="editrFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分类数据列表
      cateList: [],
      // 被选择中的分类id
      selectedKeys: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // tab标签页默认被选中的页面
      activeName: 'many',
      // 动态参数数据
      manyTable: [],
      // 静态属性数据
      onlyTable: [],
      // 控制添加参数对话框
      addDialogVisible: false,
      // 添加参数对话框表格数据
      attrFrom: {
        attr_name: '',
      },
      // 对话框表单校验规则
      attrFromRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
      // 控制编辑对话框开关
      editDialogVisible: false,
      // 编辑对话框表单参数
      editrFrom: {
        attr_name: '',
        attr_id: '',
      },
      // 编辑对话框表单校验规则
      editFromRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
      // 控制动态编辑标签切换形态
      inputVisible: false,
      // 动态标签的输入框的值
      inputValue: '',
    }
  },
  methods: {
    // 发送请求，获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200)
        return this.$message.error('获取分类信息失败')
      this.cateList = res.data
    },
    // 级联选择器发生变化时，触发
    handleChange() {
      this.getAttrList()
    },
    // tab标签页发生变化时，触发
    handleClick() {
      this.getAttrList()
    },
    // 获取参数列表
    async getAttrList() {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTable = []
        this.onlyTable = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      )
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取参数列表失败')
      // 根据当前所选标签页进行赋值
      if (this.activeName === 'many') {
        this.manyTable = res.data
      } else {
        this.onlyTable = res.data
      }
    },
    // 当添加参数对话框关闭时，重置其内容
    addDialogClosed() {
      this.$refs.addAttrFromRef.resetFields()
    },
    // 点击按钮后，更新参数信息
    addParams() {
      this.$refs.addAttrFromRef.validate(async (valid) => {
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.attrFrom.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getAttrList()
        this.addDialogVisible = false
      })
    },
    // 编辑参数对话框关闭后，重置其内容
    editDialogClosed() {
      this.$refs.editAttrFromRef.resetFields()
    },
    // 编辑对话框出现后，发送请求，将要编辑的信息呈现
    async showEditDialog(id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get(
        `categories/${this.cateID}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('获取参数信息失败')
      }
      this.editrFrom = res.data
    },
    // 发送请求，更新参数信息
    editParams() {
      this.$refs.editAttrFromRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.editrFrom.attr_id}`,
          {
            attr_name: this.editrFrom.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新参数信息失败')
        }
        this.getAttrList()
        this.editDialogVisible = false
      })
    },
    // 删除选中的参数信息
    async deleteParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((error) => error)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateID}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数信息失败')
        }
        this.getAttrList()
      }
    },
    // 输入框失去焦点时调用
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.editParamsVals(row)
    },
    // 控制输入框出现，并自动获取焦点
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 当标签被删除时，更新对应参数属性值
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1)
      this.editParamsVals(row)
    },
    // 更新参数的属性值
    async editParamsVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新参数属性值失败')
      }
      this.$message.success('更新参数属性值成功')
    },
  },
  // 创造生命周期
  created() {
    this.getCateList()
  },
  // 计算属性
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的第三级分类
    cateID() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 根据分页的不同，返回对应的text值
    textContent() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>
<style lang="less" scoped>
.opt {
  margin: 15px;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 150px;
}
</style>