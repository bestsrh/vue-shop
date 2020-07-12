<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类的按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!-- data表格各行数据、columns表格各列配置、selection-type复选框、expand-type展开行、show-index索引列-->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效列表 -->
        <template slot="isTrue" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-erroe" v-else style="color: red"></i>
        </template>
        <!-- 排序列表 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作列表 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" @click="showEditCate(scope.row)" icon="el-icon-edit" >编辑</el-button>
          <el-button type="danger" @click="deleteCate(scope.row)" icon="el-icon-delete" >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称：">
          <!-- options-指定数据源 -->
          <!-- props-指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            expandTrigger="hover"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate"
            >确 定</el-button
          >
        </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogVisibleClose">
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
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
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 表格各列配置
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          // 使用具名插槽
          label: '是否有效',
          type: 'template',
          template: 'isTrue'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      // 控制添加分类的对话框显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类的等级默认是1级
        cat_level: 0
      },
      // 添加分类的表单验证规则
      addCateFormRules: {
        cat_name: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }
      },
      // 获取父级分类的数据
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选择父级分类ID数组
      selectedKeys: [],
      // 修改分类
      editCateForm: {
        cat_name: ''
      },
      // 修改分类验证对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败!')
      }
      // console.log(res.data); // 查询到商品分类信息

      // 把数据赋值给 catelist
      this.catelist = res.data.result
      // 把数据赋值给 总数据条数 total
      this.total = res.data.total
    },
    // 监听pagesize事件-每页显示的个数
    // 假如30条数据，pagesize为5，每页显示5条，有6页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pageNum事件-当前页改变事件
    // 你点第几页，显示第几页的数据
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击添加分类，弹出对话框
    showAddCateDialog() {
      // 先获取父级分类的数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败!')
      }
      // console.log(res.data);
      this.parentCateList = res.data
    },
    // 级联选择器选中结点发生变化
    parentCateChange() {
      // 如果选择ID大于0，说明选中了父类
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    async addCate() {
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        console.log(res.data);
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      
    },
    // 监听对话框的关闭事件并且重置表单
    addCateDialogClosed() {
      // 调用结点清除表单数据
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // 修改分类
    async showEditCate(id) {
      // 根据分类id请求分类对象信息
      const { data: res } = await this.$http.get(`categories/${id.cat_id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('修改分类信息失败')
      }
      this.editCateForm = res.data
      this.editDialogVisible = true
    },
    // 关闭编辑分类对话框，重置表单
    editDialogVisibleClose() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击确定，提交表单
    async editCate() {
      const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, this.editCateForm)
      if(res.meta.status !== 200) {
        return this.$message.error('修改分类失败')
      }
      this.$message.success('修改分类成功')
      this.editDialogVisible = false
      this.getCateList()
    },
    // 删除分类
    async deleteCate(id) {
      const resResult = await this.$confirm(
        '此操作将删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resResult !== 'confirm') {
        return this.$message.info('分类已经取消删除')
      }
      const { data: ref } = await this.$http.delete(
        `categories/${id.cat_id}`
      )
      if (ref.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      this.getCateList()
      
    },
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-left: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
