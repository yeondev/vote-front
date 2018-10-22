<style scoped>
  .deletedInput >>> .el-input__inner {
    text-decoration: line-through;
  }
</style>
<template>
  <div align="right">
    <el-select v-model="$i18n.locale">
      <el-option v-for="localeInfo in localeTable"
                 :key="localeInfo.value"
                 :value="localeInfo.value"
                 :label="localeInfo.label"></el-option>
    </el-select>
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
  name: 'VoteHeaderBar',
  data () {
    return {
      localeTable: [
        {
          value: 'ko',
          label: '한국어'
        },
        {
          value: 'jp',
          label: '日本語'
        },
        {
          value: 'en',
          label: 'English'
        }
      ]
    }
  }
}
</script>
