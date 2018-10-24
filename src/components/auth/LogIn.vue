<template>
  <div>
    <el-form ref="form" :model="loginForm" label-width="80px" v-loading="loading">
      <el-form-item v-bind:label="$t('message.WORD_EMAIL')" label-width="100px">
        <el-col :span="10">
          <el-input
            v-bind:placeholder="$t('message.WORD_EMAIL')"
            v-model="loginForm.email"
            @keyup.enter.native="doLogIn()"></el-input>
        </el-col>
      </el-form-item>
    <el-form-item v-bind:label="$t('message.WORD_PASSWORD')" label-width="100px">
        <el-col :span="10">
          <el-input
            v-bind:placeholder="$t('message.WORD_PASSWORD')"
            v-model="loginForm.password"
            @keyup.enter.native="doLogIn()"></el-input>
        </el-col>
      </el-form-item>
      <el-button @click="doLogIn()">Login</el-button>
      <router-link :to="urls.register">
        <el-button>{{ $t('message.WORD_REGISTER') }}</el-button>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import Urls from '@/components/source/parts/Urls'
import HttpStatus from 'http-status-codes'

export default {
  data: function () {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      urls: {
        register: Urls.register.path
      },
      validated: {
        isConnectError: false
      },
      loading: false
    }
  },
  methods: {
    afterProcess: function (response) {
      console.log('begin afterProcess : ', response)
      switch (response.status) {
        case HttpStatus.OK:
          localStorage.setItem('user-token', response.headers['authorization']) // store the token in local-storage
          break
        case HttpStatus.UNAUTHORIZED:
          this.$message({message: '인증에 실패하였습니다!', type: this.Const.MESSAGE_LEVEL.WARNING})
          break
        case HttpStatus.FORBIDDEN:
          const responseCode = response.data.message
          if (responseCode === '1') {
            this.$message({message: '인증 메일을 확인하신 후 인증을 완료해주세요!', type: this.Const.MESSAGE_LEVEL.WARNING})
          } else if (responseCode === '2') {
            this.$message({message: '인증메일이 만료된 계정입니다. 다시 한번 인증메일을 발송하였으니 확인하신 후 인증을 완료해주세요!', type: this.Const.MESSAGE_LEVEL.WARNING})
            // todo : 인증메일 재배송요청
          }
          break
        default:
          this.validated.isConnectError = true
          break
      }
      if (response.status !== 200) {
        localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
      }
    },
    doLogIn: function () {
      if (!this.loginForm.email) {
        this.$message({message: '아이디를 입력해주세요.', type: this.Const.MESSAGE_LEVEL.WARNING})
        return
      }
      if (!this.loginForm.password) {
        this.$message({message: '패스워드를 입력해주세요.', type: this.Const.MESSAGE_LEVEL.WARNING})
        return
      }
      this.loading = true
      this.$http.post(this.Const.API_URL.dev + `/login`, {
        email: this.loginForm.email,
        password: this.loginForm.password
      }).then((response) => {
        this.afterProcess(response)
      }).catch((err) => {
        this.afterProcess(err.response)
      }).finally(() => {
        if (this.validated.isConnectError) {
          this.$message({message: '저희 본의는 아닌데 이메일 확인 시도 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', type: this.Const.MESSAGE_LEVEL.ERROR})
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
