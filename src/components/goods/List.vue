<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 表头查询区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            width="130px"
            clearable
            v-model="queryInf.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="goodsList"
        stripe
        border
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="130">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="130">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoods(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInf.pagenum"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="queryInf.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取商品列表信息的查询参数
      queryInf: {
        query: '',
        pagenum: 1,
        pagesize: 20,
      },
      // 商品列表信息
      goodsList: [],
      // 商品总数
      total: 0,
    }
  },
  methods: {
    //发送请求，获取商品列表信息
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInf,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表信息失败')
      }
      this.$message.success('获取商品列表信息成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 获取最新的页面信息数量，并刷新页面
    handleSizeChange(newSize) {
      this.queryInf.pagesize = newSize
      this.getGoodsList()
    },
    // 获取最新的页数，并刷新页面
    handleCurrentChange(newPage) {
      this.queryInf.pagenum = newPage
      this.getGoodsList()
    },
    // 根据商品id，删除对应的商品信息
    async removeGoods(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品信息失败')
        }
        this.$message.success('删除商品信息成功')
        this.getGoodsList()
      }
    },
    // 前往添加商品信息页面
    goAddPage() {
      this.$router.push('/goods/add')
    },
  },
  created() {
    this.getGoodsList()
  },
}
</script>
<style lang="less" scoped>
.el-table {
  margin: 15px 0;
}
</style>
