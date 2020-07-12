<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色按钮区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRolesById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRolesById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRole(scope.row.id)"
            ></el-button>
            <!-- 分配权限按钮 -->
            <el-button
              type="warining"
              icon="el-icon-setting"
              size="mini"
              @click="setRightDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="50%" @click="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"  :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addRoleRules"
        ref="addRoleRef"
        label-width="63px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">重 置</el-button>
        <el-button type="primary" @click="addRole">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框区域 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editRole"
        :rules="editRoleRules"
        ref="editRoleRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有的角色列表信息
      roleList: [],
      // 所有的权限列表信息
      rightsList: [],
      // 控制用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 当前即将分配权限的角色id
      roleId: '',
      // 查询到的用户信息保存
      editRole: {},
      // 控制修改用户对话框的显示和隐藏
      editDialogVisible: false,
      // 控制分配权限的对话框显示和隐藏
      setRightsDialogVisible: false,
      // 树形控件
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选择树的节点ID值
      defKeys: [],
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '角色名的长度在1到20个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色描述在2到10个字符之间',
            trigger: 'blur'
          }
        ]
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 20,
            message: '角色名的长度在1到20个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色描述在2到10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message('获取角色列表数据失败')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 监听角色对话框的关闭事件
    addDialogClose() {
      this.$refs.addRoleRef.resetFields()
    },
    // 点击按钮，添加新角色
    addRole() {
      this.$refs.addRoleRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        // 验证通过了，可以发起请求了
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.mg_state !== 200) {
          this.$message.error('用户信息上传失败')
        }
        this.$message.success('用户信息上传成功')
        // 隐藏用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getRolesList()
      })
    },
    // 展示编辑角色的按钮
    async editDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色失败')
      }
      this.editRole = res.data
      this.editDialogVisible = true
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    // 修改角色信息并提交
    editRolesInfo() {
      this.$refs.editRoleRef.validate(async valid => {
        if (!valid) return
        // 修改角色通过规则，发起请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editRole.roleId,
          {
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新角色信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新列表
        this.getRolesList()
        // 提示刷新成功
        return this.$message.success('更新角色信息成功')
      })
    },
    // 根据ID删除对应的角色
    async removeRole(id) {
      const res = await this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('角色已经取消删除')
      }
      const { data: re } = await this.$http.delete('roles/' + id)
      if (re.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    // 删除三级权限中的角色按钮
    async removeRolesById(role, rightId) {
      const resResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (resResult !== 'confirm') {
        return this.$message.info('权限已经取消删除')
      }
      const { data: ref } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (ref.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')
      // this.getRolesList()
      role.children = ref.data
    },
    // 分配权限对话框的功能
    async setRightDialog(role){
      this.roleId = role.id
      // 获取所有权限数据
      const {data: res} = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的数据保存到data中
      this.rightsList = res.data;

      // 递归获取三级节点ID
      this.getLeafKeys(role, this.defKeys)
      // console.log(this.getLeafKeys);
      
      this.setRightsDialogVisible = true;
    },
    // 通过递归的形式，获取角色下选择权限的ID，并保存到defKeys中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights(){
      // 展开运算符,将一个数组转为用逗号分隔的参数序列
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),]
        // console.log(keys);
        const idStr = keys.join(',')
        // console.log(idStr);
        const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
        if (res.meta.status !== 200) {
          return this.$message.error('分配当前角色权限失败')
        }
        this.$message.success('分配当前角色权限成功')
        this.getRolesList()
        this.setRightsDialogVisible = false;
    }
    
  }
}
</script>
<style lang="less" scoped>
.el-form-item__content {
  margin-left: 82px;
}
.el-dialog {
  width: 60%;
  z-index: 20002;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
