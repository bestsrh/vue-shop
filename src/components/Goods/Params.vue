<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许使用第三分类设置的相关参数"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选中商品的选择框 -->
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            expandTrigger="hover"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 切换标签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTagClick">
        <!-- 添加动态参数列表 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="tagAddParams"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加文本框 -->
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
                <!-- 添加标签 -->
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
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性列表 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="tagAddParams"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加文本框 -->
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
                <!-- 添加标签 -->
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
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
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
      :title="titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="addParams" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="titleText1"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="120px">
        <el-form-item :label="titleText1" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="editParams" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的ID
        cat_pid: 0,
        // 分类的等级默认是1级
        cat_level: 0
      },
      // 级联选择框双向绑定到的数组
      selectedKeys: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 默认的页签名名称
      activeName: 'many',
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加属性对话框的显示
      addDialogVisible: false,
      // 添加表单数据
      addForm: {},
      // 添加表单的校验规则
      addFormRules: {
        attr_name: {
          required: true,
          message: '请输入属性名称',
          trigger: 'blur'
        }
      },
      // 控制修改属性对话框的显示
      editDialogVisible: false,
      // 修改表单数据
      editForm: {},
      
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status != 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.cateList = res.data
    },
    // 级联选择框发生变化，会触发函数
    handleChange() {
      this.getParamsData()
    },
    // tab标签页点击触发函数
    handleTagClick() {
      // console.log(this.activeName);
      this.getParamsData()
    },
    // 获取参数列表数据
    async getParamsData() {
      // 如果选择的不是三级分类，级联选择框清空
      if (this.selectedKeys.length != 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 打印出来选择的三级分类
      // console.log(this.selectedKeys)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
        // 控制文本框的显示
        item.inputVisible = false;
        // 文本框输入的内容
        item.inputValue = '';
      })

      console.log(res.data)
      // console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 控制添加对话框的显示与隐藏
    tagAddParams() {
      this.addDialogVisible = true
    },
    // 控制修改对话框的显示与隐藏
    tagEditParams() {
      this.editDialogVisible = true
    },
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    async addParams() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
      )
      if (res.meta.status !== 201) {
        return this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
      this.addDialogVisible = false
      this.getParamsData()
    },
    // 点击按钮，展示修改列表的信息
    async showEditParams(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('数据查询失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改按钮后，确定提交
    async editParams() {
      const {
        data: res
      } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
      )

      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error('修改数据更新失败')
      }
      this.$message.success('修改数据更新成功')
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 点击按钮，删除参数
    async deleteParams(id) {
      const resResult = await this.$confirm(
        '此操作将删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resResult !== 'confirm') {
        return this.$message.info('参数已经取消删除')
      }
      const { data: ref } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (ref.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    // 文本框失去焦点或按下enter键
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = ' '
        row.inputVisible = false
        return
      }
      // 如果没有return，则要进行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 对数据库发起请求，保存修改
      this.saveValues(row)
      
    },
    // 对attr_vals的操作，保存到数据库中
    async saveValues(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('上传数据更新失败')
      }
      this.$message.success('上传数据成功')
    },
    // 点击按钮，文本框出现
    showInput(id) {
      id.inputVisible = true
      // 让文本框自动获取焦点
      // 当页面被重新渲染之后，才会调用函数
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 删除对应的文本框
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveValues(row)
      
    }
  },
  computed: {
    // 没有选中三级分类时候，添加按钮禁用
    isBtnDisabled() {
      if (this.selectedKeys.length != 3) {
        return true
      }
      return false
    },
    // 绑定的三级分类ID
    cateId() {
      if (this.selectedKeys.length == 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '添加动态属性'
      } else {
        return '添加静态属性'
      }
    },
    titleText1() {
      if (this.activeName === 'many') {
        return '修改动态属性'
      } else {
        return '修改静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag{
  width: 100px;
}
</style>
