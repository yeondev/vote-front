<template>
  <div>
    <el-form ref="form" :model="dataForm" label-width="80px"
             v-loading="registLoading"
             element-loading-text="$t('message.MESSAGE_2')"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-form-item label="E-mail" label-width="100px">
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
      <el-form-item v-bind:label="$t('message.WORD_3')" label-width="100px">
        <el-col :span="20">
          <el-input v-bind:placeholder="$t('message.MESSAGE_5')"
                    clearable
                    v-model="dataForm.username"
                    @change="checkName()"></el-input>
        </el-col>
      </el-form-item>
      <!-- 비밀번호  -->
      <el-form-item v-bind:label="$t('message.WORD_4')" label-width="100px">
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
      <el-form-item v-bind:label="$t('message.WORD_5')" label-width="100px" >
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
        <button class="btn btn-primary" @click="requestRegistration()">{{ $t('message.WORD_2') }}</button>
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
        this.callMessage('데이터가 뭔가 이상한데.. 입력한 정보를 다시 확인해보시겠어요?', this.Const.MESSAGE_LEVEL.WARNING)
        return
      }
      // 요청
      this.emailLoading = true
      this.$http.get(this.Const.API_URL.dev + `/registration/check?email=` + this.dataForm.email)
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
            this.callMessage('저희 본의는 아닌데 이메일 확인 시도 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', this.Const.MESSAGE_LEVEL.ERROR)
          } else if (this.validated.isEmailVerified && this.validated.email) {
            this.callMessage('이 이메일 주소는 사용 가능해요!', this.Const.MESSAGE_LEVEL.SUCCESS)
          } else if (this.validated.isSentVerifyCheck && !this.validated.isEmailVerified) {
            this.callMessage('이메일 주소가 왜인지 이미 등록되어 있어요. :( ', this.Const.MESSAGE_LEVEL.WARNING)
          }
          this.emailLoading = false
        })
    },
    requestRegistration: function () {
      if (!this.validated.isSentVerifyCheck ||
        !this.validated.password || !this.validated.username || !this.validated.email) {
        console.log(this.validated.isSentVerifyCheck, this.validated.password, this.validated.username, this.validated.email)
        this.callMessage('데이터가 뭔가 이상한데.. 입력한 정보를 다시 확인해보시겠어요?', this.Const.MESSAGE_LEVEL.WARNING)
        return
      }
      this.registLoading = true
      this.$http.post(this.Const.API_URL.dev + `/registration`, {
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
            this.callMessage('저희 본의는 아닌데 이메일 확인 시도 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', this.Const.MESSAGE_LEVEL.ERROR)
          } else if (this.validated.isSuccessRegist) {
            this.callMessage('입력하신 이메일로 인증 메일이 도착했을테니, 확인해주세요!', this.Const.MESSAGE_LEVEL.SUCCESS)
          } else if (!this.validated.isSuccessRegist) {
            this.callMessage('어떤 이유인지, 회원 가입을 실패했습니다.. ', this.Const.MESSAGE_LEVEL.WARNING)
          }
          this.registLoading = false
        })
    },
    checkName: function () {
      if (this.dataForm.username === '') {
        this.callMessage('이름/닉네임은 필수로 입력해야 합니다. ', this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.username = false
      } else {
        this.validated.username = true
      }
    },
    checkPassword: function () {
      if (this.dataForm.password === '') {
        this.callMessage('?? 패스워드가 없으면 로그인을 할 수가 없으세요!', this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.password = false
      } else {
        this.validated.password = true
      }
    },
    checkPasswordConfirm: function () {
      if (this.dataForm.password !== this.dataForm.passwordConfirm) {
        this.callMessage('위에 입력하신 패스워드와 동일한 패스워드를 입력해주셔야 해요!', this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.password = false
      }
    },
    validEmail: function (emailValue) {
      let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(emailValue)
    },
    callMessage: function (message, pattern) {
      if (pattern === this.Const.MESSAGE_LEVEL.ERROR) {
        this.$message.error(message)
      } else {
        this.$message({
          message: message, type: pattern
        })
      }
    }
  }
}
</script>
