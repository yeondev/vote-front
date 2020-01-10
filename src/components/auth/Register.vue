<template>
  <div>
    <el-form ref="form" :model="dataForm" label-width="80px"
             v-loading="registLoading"
             element-loading-text="$t('message.MESSAGE_2')"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form-item label="E-mail" label-width="150px">
          <el-col :span="20">
            <el-input
              v-loading="emailLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              v-bind:placeholder="$t('message.MESSAGE_4')"
              v-model="dataForm.email"
              @keyup.enter.native="checkEmailAvailable()"
              @change="checkEmailAvailable()"></el-input>
          </el-col>
        </el-form-item>
      <!-- 이름(닉네임) -->
      <el-form-item v-bind:label="$t('message.WORD_NAME_NICK')" label-width="150px">
        <el-col :span="20">
          <el-input v-bind:placeholder="$t('message.MESSAGE_5')"
                    clearable
                    v-model="dataForm.username"
                    @change="checkName()"></el-input>
        </el-col>
      </el-form-item>
      <!-- 비밀번호  -->
      <el-form-item v-bind:label="$t('message.WORD_PASSWORD')" label-width="150px">
        <el-col :span="20">
          <el-input
              v-bind:placeholder="$t('message.MESSAGE_6')"
              clearable v-model="dataForm.password"
              @change="checkPassword()"></el-input>
          <!--<input type="password" v-model="dataForm.password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />-->
          <div v-show="submitted && !dataForm.password" class="invalid-feedback">Password is required</div>
        </el-col>
      </el-form-item>
      <!-- 비밀번호 확인 -->
      <el-form-item v-bind:label="$t('message.WORD_5')" label-width="150px" >
        <el-col :span="20">
          <el-input
            v-bind:placeholder="$t('message.MESSAGE_7')"
            clearable v-model="dataForm.passwordConfirm"
            @change="checkPasswordConfirm()"></el-input>
          <!--<input type="password" v-model="dataForm.passwordConfirm" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />-->
        </el-col>
      </el-form-item>
      <div class="form-group">
        <!-- 등록하기 -->
        <button class="btn btn-primary" @click="requestRegistration()">{{ $t('message.WORD_REGISTER') }}</button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      submitted: false,
      emailLoading: false,
      registLoading: false,
      dataForm: {
        username: '',
        password: '',
        passwordConfirm: '',
        email: ''
      },
      validated: {
        username: false,
        password: false,
        email: false,
        isSafeEmail: true,
        isSentVerifyCheck: false,
        isEmailVerified: false,
        isConnectError: false,
        isSuccessRegist: false
      }
    }
  },
  watch: {
    'dataForm.email': function (val, oldVal, e) {
      this.validated.email = !!this.validEmail(val)
    },
    'dataForm.password': function (val, oldVal, e) {
      // todo: check
      this.checkPassword()
    }
  },
  methods: {
    /**
     * 이메일 체크
     */
    checkEmailAvailable: function () {
      if (!this.validated.isSafeEmail || !this.validated.email) {
        this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_6'), this.Const.MESSAGE_LEVEL.WARNING)
        return
      }
      // 요청
      this.emailLoading = true
      console.log(this.Const.API_URL.dev)
      console.log(this.Const.API_URL.dev)
      this.$http.post(this.Const.API_URL.dev + `/registration/check/email`, {
        email: this.dataForm.email
      }, {
        headers: {}})
        .then((response) => {
          console.log(response)
          this.validated.isEmailVerified = response.data.result
          this.validated.isSentVerifyCheck = true
        }).catch((err) => {
          console.log(err)
          this.validated.isConnectError = true
        }).finally((response) => {
          console.log(response)
          if (this.validated.isConnectError) {
            this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_1'), this.Const.MESSAGE_LEVEL.ERROR)
          } else if (this.validated.isEmailVerified && this.validated.email) {
            this.callMessage(this.$i18n.t('message.MESSAGE_12'), this.Const.MESSAGE_LEVEL.SUCCESS)
          } else if (this.validated.isSentVerifyCheck && !this.validated.isEmailVerified) {
            this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_5'), this.Const.MESSAGE_LEVEL.WARNING)
          }
          this.emailLoading = false
        })
    },
    requestRegistration: function () {
      if (!this.validated.isSentVerifyCheck ||
        !this.validated.password || !this.validated.username || !this.validated.email) {
        console.log(this.validated.isSentVerifyCheck, this.validated.password, this.validated.username, this.validated.email)
        this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_6'), this.Const.MESSAGE_LEVEL.WARNING)
        return
      }
      this.registLoading = true
      this.$http.post(this.Const.API_URL.dev + `/member/registration`, {
        email: this.dataForm.email,
        name: this.dataForm.username,
        password: this.dataForm.password
      })
        .then((response) => {
          console.log(response)
          this.validated.isSuccessRegist = response.data.result
          this.msg = response
        }).catch((err) => {
          console.log(err)
          this.validated.isConnectError = true
        }).finally((response) => {
          console.log(response)
          if (this.validated.isConnectError) {
            this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_1'), this.Const.MESSAGE_LEVEL.ERROR)
          } else if (this.validated.isSuccessRegist) {
            this.callMessage(this.$i18n.t('message.MESSAGE_13'), this.Const.MESSAGE_LEVEL.SUCCESS)
          } else if (!this.validated.isSuccessRegist) {
            this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_7'), this.Const.MESSAGE_LEVEL.WARNING)
          }
          this.registLoading = false
        })
    },
    checkName: function () {
      if (this.dataForm.username === '') {
        this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_8'), this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.username = false
      } else {
        this.validated.username = true
      }
    },
    checkPassword: function () {
      if (this.dataForm.password === '') {
        this.callMessage(this.$i18n.t('message.ERROR_MESSAGE_9'), this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.password = false
      } else {
        this.validated.password = true
      }
    },
    checkPasswordConfirm: function () {
      if (this.dataForm.password !== this.dataForm.passwordConfirm) {
        this.callMessage(this.$i18n.t('message:ERROR_MESSAGE_10'), this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.password = false
      }
    },
    validEmail: function (emailValue) {
      let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(emailValue)
    },
    callMessage: function (message, pattern) {
      if (pattern === this.Const.MESSAGE_LEVEL.ERROR) {
        this.$message.error(this.$t(message))
      } else {
        this.$message({
          message: message, type: pattern
        })
      }
    }
  }
}
</script>
