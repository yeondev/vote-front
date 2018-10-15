<style scoped>
  .deletedInput >>> .el-input__inner {
    text-decoration: line-through;
  }
</style>
<template>
  <div align="right">
    <router-link :to="Const.ROUTER_URLS.login">
      <el-button size="mini">로그인</el-button>
    </router-link>
    <router-link :to="Const.ROUTER_URLS.register">
      <el-button size="mini">등록하기</el-button>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'VoteHeaderBar'
}
</script>
