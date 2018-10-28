<template>
  <div>
    <div>
    <router-link :to="urls.create">
      <el-button>{{ $t("message.WORD_MAKE_VOTE") }}</el-button>
    </router-link>
    </div>
    <!--<span>{{ $t("message.MESSAGE_1") }}</span>-->
  </div>
</template>

<script>
import Urls from '@/components/source/parts/Urls'
import HttpStatus from 'http-status-codes'

export default {
  name: 'MainBoard',
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
      this.$http.get(this.Const.API_URL.dev + `/login/check`)
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
