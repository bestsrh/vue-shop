<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/Da19.png" alt="" srcset="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="rgb(178, 221, 243)" text-color="#fff" active-text-color="#ffd04b" unique-opened router :default-active="activePath"
        >
          <!-- 一级菜单的模板区域 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!-- 图标区域 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本区域 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单区域 -->
            <el-menu-item :index="'/' + item.path"  v-for="item in item.children" :key="item.id" @click="saveNavState('/' + item.path)">
              <template slot="title">
                <i class="el-icon-star-off"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-lock_fill',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: ' '
    }
  },
  created() {
    this.getMenuList(),
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    exit() {
      // 清除token缓存
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const {data: res} = await this.$http.get('menus');
      if (res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res);
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(77, 189, 209);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
  img {
    width: 40px;
    height: 40px;
  }
}

.el-aside {
  background-color: rgb(178, 221, 243);
  .iconfont{
    margin-right: 10px;
  }
  .el-menu{
    border-right: 0;
  }
}

.el-main {
  background-color: rgb(229, 233, 237);
}
</style>
