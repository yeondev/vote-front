<template>
  <div>
    <LogIn />
    <div>
    <router-link :to="urls.create">
      <el-button>로그인하지 않아도 새로운 투표를 만들 수 있습니다.</el-button>
    </router-link>
    </div>
  </div>
</template>

<script>
import Urls from '@/components/source/parts/Urls'
import LogIn from '@/components/auth/LogIn'
import HttpStatus from 'http-status-codes'

export default {
  name: 'MainBoard',
  components: {
    LogIn
  },
  data () {
    return {
      urls: {
        create: Urls.vote.create.path
      },
      validated: {
        isConnectError: true
      }
    }
  },
  mounted: function () {
    this.loginCheck()
  },
  methods: {
    moveToLogin: function () {
      this.$router.push('/login')
    },
    afterProcess: function (response) {
      console.log('afterProcess begin : ', response)
      // if (!response) {
      //   this.moveToLogin()
      // }
      const status = response.status
      switch (status) {
        case HttpStatus.OK:
          // todo: to main
          this.$router.push('/vote/dashboard')
          break
        case HttpStatus.UNAUTHORIZED:
          // todo: to login
          break
        default:
          // this.$router.push('/login')
      }
    },
    loginCheck: function () {
      this.$http.get(`http://back-vote.herokuapp.com/api/v1/login/check`)
        .then((response) => {
          this.afterProcess(response)
        }).catch((err) => {
          this.afterProcess(err.response)
        }) // not to do anymore
    }
  }
}
</script>

<style scoped>

</style>
