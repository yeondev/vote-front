<template>
  <div>
    <h2>Login</h2>
    <el-form ref="form" :model="loginForm" label-width="80px" v-loading="loading">
      <el-form-item label="email" label-width="100px">
        <el-col :span="10">
          <el-input
            placeholder="아이디"
            v-model="loginForm.email"
            @keyup.enter.native="doLogIn()"></el-input>
        </el-col>
      </el-form-item>
    <el-form-item label="password" label-width="100px">
        <el-col :span="10">
          <el-input
            placeholder="패스워드"
            v-model="loginForm.password"
            @keyup.enter.native="doLogIn()"></el-input>
        </el-col>
      </el-form-item>
      <el-button @click="doLogIn()">Login</el-button>
      <router-link :to="urls.register">
        <el-button>등록하기</el-button>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import Urls from '@/components/source/parts/Urls'
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
      Const: { // todo: move to const
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error'
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
        case 200:// todo: to be const
          localStorage.setItem('user-token', response.headers.authorization) // store the token in localstorage
          break
        case 401:// todo: to be const
          this.$message({message: '인증에 실패하였습니다!', type: this.Const.WARNING})
          break
        case 403:
          const responseCode = response.data.message
          if (responseCode === '1') {
            // todo: to be const
            this.$message({message: '인증 메일을 확인하신 후 인증을 완료해주세요!', type: this.Const.WARNING})
          } else if (responseCode === '2') {
            // todo : to be  const
            this.$message({message: '인증메일이 만료된 계정입니다. 다시 한번 인증메일을 발송하였으니 확인하신 후 인증을 완료해주세요!', type: this.Const.WARNING})
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
        this.$message({message: '아이디를 입력해주세요.', type: this.Const.WARNING})
        return
      }
      if (!this.loginForm.password) {
        this.$message({message: '패스워드를 입력해주세요.', type: this.Const.WARNING})
        return
      }

      this.loading = true
      this.$http.post(`http://192.168.0.6:3000/api/v1/login`, {
        email: this.loginForm.email,
        password: this.loginForm.password
      }).then((response) => {
        this.afterProcess(response)
      }).catch((err) => {
        this.afterProcess(err.response)
      }).finally(() => {
        if (this.validated.isConnectError) {
          this.$message({message: '저희 본의는 아닌데 이메일 확인 시도 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', type: this.Const.ERROR})
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
