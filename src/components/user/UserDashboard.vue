<template>
  <div>
    <span>{{userInfo.username}} 님 안녕하세요.</span>

    <!--todo: -->
    <span>현재 진행중인 투표가 없어요!</span>
    <router-link to="/vote/create">
      <el-button>새로운 투표를 만들어보자!</el-button>
    </router-link>
  </div>
</template>
<script>
export default {
  name: 'UserDashboard',
  data () {
    return {
      userInfo: {
        username: '',
        email: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
