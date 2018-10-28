<template>
  <div>
    <el-form ref="form" :model="loginForm" label-width="80px" v-loading="loading">
      <el-form-item v-bind:label="$t('message.WORD_EMAIL')">
        <el-col :xs="20"
                :sm="16"
                :md="14"
                :lg="10"
                :xl="6">
          <el-input
            v-bind:placeholder="$t('message.WORD_EMAIL')"
            v-model="loginForm.email"
            @keyup.enter.native="doLogIn()"></el-input>
        </el-col>
      </el-form-item>
    <el-form-item v-bind:label="$t('message.WORD_PASSWORD')">
        <el-col :xs="20"
                :sm="16"
                :md="14"
                :lg="10"
                :xl="6">
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
          this.getUserInfo()
          break
        case HttpStatus.UNAUTHORIZED:
          this.$message({message: this.$t('message.ERROR_MESSAGE_4'), type: this.Const.MESSAGE_LEVEL.WARNING})
          break
        case HttpStatus.FORBIDDEN:
          const responseCode = response.data.message
          if (responseCode === '1') {
            this.$message({message: this.$t('message.MESSAGE_10'), type: this.Const.MESSAGE_LEVEL.WARNING})
            // todo: 인증번호 입력 페이지 출력하기
          } else if (responseCode === '2') {
            this.$message({message: this.$t('message.MESSAGE_11'), type: this.Const.MESSAGE_LEVEL.WARNING})
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
        this.$message({message: this.$t('message.ERROR_MESSAGE_2'), type: this.Const.MESSAGE_LEVEL.WARNING})
        return
      }
      if (!this.loginForm.password) {
        this.$message({message: this.$t('message.ERROR_MESSAGE_3'), type: this.Const.MESSAGE_LEVEL.WARNING})
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
      }).finally(() => this.finalAction())
    },
    getUserInfo: function () {
      this.$http.get(this.Const.API_URL.dev + `/user/me`)
        .then((response) => {
          console.log(response)
        }).catch((err) => {
          this.afterProcess(err.response)
        }).finally(() => this.finalAction())
    },
    finalAction: function () {
      if (this.validated.isConnectError) {
        this.$message({message: this.$t('message.ERROR_MESSAGE_1'), type: this.Const.MESSAGE_LEVEL.ERROR})
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
