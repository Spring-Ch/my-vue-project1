<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警示条区域 -->
      <el-alert title="添加商品信息" type="info" :closable="false" center>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :active="active - 0"
        finish-status="success"
        :space="300"
        :align-center="true"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 商品列表表单 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsFormRules"
        ref="addGoodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 标签页区域 -->
        <el-tabs
          v-model="active"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabChanged"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="cateForm"
                :props="cateProps"
                clearable
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品静态属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片上传 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsForm.goods_introduce"
            />
            <el-button type="primary" class="addGood" @click="addGood"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片上传预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="商品图片" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
// 导入loadsh插件
import _ from 'lodash'
export default {
  data() {
    return {
      //步骤条当前活动步骤
      active: '0',
      // 添加商品信息表单域
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: [],
      },
      // 添加商品表单验证规则
      addGoodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // 商品分类信息列表数据
      cateForm: [],
      // 商品分类级联选择器的属性配置项
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 商品动态参数信息列表
      manyTableData: [],
      // 商品静态属性信息列表
      onlyTableData: [],
      // 定义图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 商品图片预览路径
      previewPath: '',
      // 控制商品预览对话框开关
      previewVisible: false,
    }
  },
  methods: {
    // 严格控制只能选择三级分类
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 发生请求，获取商品信息分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败')
      }
      this.cateForm = res.data
    },
    // 选中3级分类后，才能离开基本信息页签
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 当前选中页签发生变化
    async tabChanged() {
      // 当选择页签名为1时，请求动态参数
      if (this.active === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取商品参数信息失败')
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.active === '2') {
        // 当选择页签为3时，请求静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取商品参数信息失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 图片预览函数
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 图片移除函数
    handleRemove(file) {
      const removePath = file.response.data.tmp_path
      const removeindex = this.addGoodsForm.pics.findIndex((item) => {
        item.pic === removePath
      })
      this.addGoodsForm.pics.splice(removeindex, 1)
    },
    // 图片上传成功函数
    handleSuccess(response) {
      const picInf = {
        pic: response.data.tmp_path,
      }
      this.addGoodsForm.pics.push(picInf)
    },
    addGood() {
      this.$refs.addGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请输入必填项')
        }
        // 执行业务添加逻辑
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          form.attrs.push(attr)
        })
        // 处理静态属性
        this.manyTableData.forEach((item) => {
          const attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          form.attrs.push(attr)
        })
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品信息失败')
        }
        this.$router.push('/goods')
      })
    },
  },
  computed: {
    // 分类长度属性
    cateID() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    },
  },
  created() {
    this.getCateList()
  },
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 10px 0 !important;
}
.previewImg {
  width: 100%;
}
// 商品添加按钮的外边距
.addGood {
  margin: 15px 0;
}
</style>