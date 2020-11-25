<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 卡片头区域 -->
      <el-row>
        <el-col :span="4">
          <el-button type="primary" @click="cateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <!-- 等级 -->
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            class="btnWidth"
            @click="showEditDialog(scope.row.cat_id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            class="btnWidth"
            @click="deleteEditDialog(scope.row.cat_id)"
          ></el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsInf.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="paramsInf.pagesize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="cateDialogVisible"
      width="50%"
      @close="cateDialogClosed"
    >
      <!-- 添加分类信息主体区域 -->
      <el-form
        :model="addCateForm"
        :rules="cateFormRules"
        ref="addCateFormRef"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="handleChange"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改分类信息主体区域 -->
      <el-form
        :model="editCateForm"
        :rules="editFormRules"
        ref="editCateFormRef"
        label-width="90px"
      >
        <el-form-item label="id:" prop="cat_id">
          <el-input v-model="editCateForm.cat_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分类列表
      catelist: [],
      // 分类列表请求数据头
      paramsInf: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品总数
      total: 0,
      // tree-table列属性
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '等级',
          type: 'template',
          template: 'level',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      // 控制分类对话框开关
      cateDialogVisible: false,
      // 添加分类信息数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类对话框验证规则
      cateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
      },
      // 添加分类对话框中父级分类数据
      parentCateList: [],
      // 选择的分类ID
      selectedKeys: [],
      // 级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
      },
      // 控制修改分类对话框开关
      editDialogVisible: false,
      // 修改分类数据
      editCateForm: {
        cat_id: '',
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      },
      // 修改分类表单规则
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 发送请求，获取分类数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.paramsInf,
      })
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 控制页面显示内容大小
    handleSizeChange(newSize) {
      this.paramsInf.pagesize = newSize
      this.getCateList()
    },
    // 控制页面切换
    handleCurrentChange(newPage) {
      this.paramsInf.pagenum = newPage
      this.getCateList()
    },
    // 添加分类对话框出现
    cateDialog() {
      this.getParentCateList()
      this.cateDialogVisible = true
    },
    // 获取父级分类列表数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2,
        },
      })

      this.parentCateList = res.data
    },
    //级联选择器发生变化后触发
    handleChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确定按钮之后，发生请求，添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) this.$message.error('添加分类信息失败')
        this.$message.success('添加分类信息成功')
        this.getCateList()
        this.cateDialogVisible = false
      })
    },
    // 监听分类对话框关闭事件，重置其内容
    cateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    //监听修改分类对话框关闭
    editDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 显示修改分类对话框
    async showEditDialog(id) {
      // 根据传入的id获取对应的分类信息
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('获取分类信息失败')
      this.editCateForm = res.data
      this.editDialogVisible = true
    },
    // 发送请求，更新分类信息
    async editCate() {
      const { data: res } = await this.$http.put(
        'categories/' + this.editCateForm.cat_id,
        {
          cat_name: this.editCateForm.cat_name,
        }
      )
      if (res.meta.status !== 200)
        return this.$message.error('更新分类信息失败')
      this.$message.success('更新分类信息成功')
      this.getCateList()
      this.editDialogVisible = false
    },
    // 删除所选的分类信息
    async deleteEditDialog(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200)
        return this.$message.error('删除分类信息失败')
      this.$message.success('删除分类信息成功')
      this.getCateList()
    },
  },
  created() {
    this.getCateList()
  },
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.btnWidth {
  width: 60px;
}
.el-cascader {
  width: 100%;
}
</style>