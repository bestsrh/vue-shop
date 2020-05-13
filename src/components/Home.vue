<template>
  <div>
    <el-button type="info" @click="exit">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    exit() {
      // 清除token缓存
      window.sessionStorage.clear()
      // 重定向到登录页面
      this.$router.push('/login')
    }
  }
}
</script>
<style lang=""></style>
