<style scoped>
  .deletedInput >>> .el-input__inner {
    text-decoration: line-through;
  }
</style>

<template>
  <div>
      <el-form ref="form" :model="dataForm" label-width="80px"
               v-loading="registLoading"
               v-bind:element-loading-text="$t('message.MESSAGE_2')"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-card>
        <ul>
          <el-row>
            <el-col :span="10">
              <el-input
                v-bind:placeholder="$t('message.WORD_TITLE')"
                v-model="dataForm.title">
              </el-input>
            </el-col>
          </el-row>
        </ul>
        </el-card>

        <el-card>
          <ul v-if="!modes.isInsertMode">
            <li
              v-for="(item, index) in Items"
              v-bind:key="item.itemid"
              v-bind:title="item.title"
              v-on:remove="item.splice(index, 1)"
            ></li>
          </ul>
          <ul v-if="modes.isInsertMode">
            <el-row v-for="(item, index) in Items"
                    v-bind:key="index"
                    type="flex">
              <el-col :span="10">
                <el-input :disabled="deletedStore.includes(index)"
                          v-bind:title="item.title"
                          v-on:remove="item.splice(index, 1)"
                          v-bind:class="{ deletedInput : deletedStore.includes(index) }"
                          v-bind:placeholder="$t('message.WORD_ITEM_INPUT')"
                          v-model="item.title"
                          v-on:keydown.tab.native="itemAddByTab(index, $event)"
                          style="margin-bottom: 5px;"
                          v-bind:ref="'inputItem_' + index"
                          ></el-input>
              </el-col>
              <el-col :span="1">
                <el-button v-if="!deletedStore.includes(index)"
                           type="danger"
                           icon="el-icon-delete"
                           @click="removeItem(index)"
                           tabindex="-1"
                           plain></el-button>
                <el-button v-if="deletedStore.includes(index)"
                           type="info"
                           icon="el-icon-delete"
                           @click="restoreItem(index)"
                           tabindex="-1"
                           plain></el-button>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="1">
                  <el-button @click="addItem">{{ $t('message.WORD_ADD_ITEM')}}</el-button>
              </el-col>
            </el-row>
          </ul>
        </el-card>

        <el-card>
        <ul>
          <el-row>
            <el-form-item v-bind:label="$t('message.WORD_PASSWORD')" label-width="120px">
            <el-col :span="10"> <!--TODO 로그인시엔 옵셔너블-->
              <el-input
                class="input_m"
                v-bind:placeholder="$t('message.WORD_PASSWORD')"
                clearable v-model="dataForm.password"
                @change="checkPassword()"></el-input>
            </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="10" align="middle">
            <el-form-item v-bind:label="$t('message.WORD_END_DATE')" label-width="120px">
            <el-col :span="10">
              <el-date-picker
                v-model="dataForm.options.endDatetime"
                type="datetime"
                size="large"
                class="input_m"
                v-bind:placeholder="$t('message.MESSAGE_8')"
                default-time="00:00:00">
              </el-date-picker>
            </el-col>
            </el-form-item>
          </el-row>
          <el-row :gutter="10" align="middle">
            <el-form-item v-bind:label="$t('message.WORD_MAX_ATTENDEE')" label-width="120px">
              <el-col :span="10" align="left">
                <el-input-number v-model="dataForm.options.maxCount" :min="0"></el-input-number>
              </el-col>
            </el-form-item>
          </el-row>
        </ul>
        <!-- 복수선택가능 -->
        <!--<ul>-->
          <!--<el-row :gutter="10">-->
            <!--<el-form-item label="답변 복수선택" label-width="120px">-->
            <!--<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">-->
                <!--<el-radio-group v-model="dataForm.options.enableMultiAnswer">-->
                  <!--<el-radio-button label="false">1개만 허용</el-radio-button>-->
                  <!--<el-radio-button label="true">여러개 허용</el-radio-button>-->
                <!--</el-radio-group>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
          <!--</el-row>-->
        <!--</ul>-->

        <!-- 항목 추가 가능-->
        <!--<ul>-->
          <!--<el-row :gutter="10">-->
            <!--<el-form-item label="항목 추가 가능" label-width="120px">-->
            <!--<el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11">-->
            <!--<el-switch-->
                <!--v-model="dataForm.options.enableAddItem"-->
                <!--active-text="허용"-->
                <!--inactive-text="허용하지 않음"-->
                <!--active-value="false"-->
                <!--inactive-value="true">-->
              <!--</el-switch>-->
            <!--</el-col>-->
            <!--</el-form-item>-->
          <!--</el-row>-->
        <!--</ul>-->
        </el-card>
      </el-form>

    <div class="form-group">
      <el-button @click="submitVote()">등록한다</el-button>
    </div>
    </div>

</template>

<script>

export default {
  data () {
    return {
      dataForm: {
        title: '',
        password: '',
        test: '',
        options: {
          endDatetime: null,
          maxCount: 0,
          enableMultiAnswer: false,
          enableAddItem: false
        }
      },
      modes: {
        isInsertMode: true
      },
      guide: {
        delete: {
          msg: '삭제한 항목은 하단 적용버튼을 클릭한 후 적용됩니다. :)',
          isDisplayed: false
        }
      },
      validated: {
        title: false,
        password: false,
        isSuccessRegist: false,
        isConnectError: false
      },
      registLoading: false,
      isKeyDownShift: false,
      deletedStore: [],
      Items: []
    }
  },
  methods: {
    itemAddByTab: function (index, e) {
      if (index === this.Items.length - 1) {
        e.preventDefault()
        this.addItem()
      }
    },
    getItemList: function () {
      // TODO: api
      if (this.itemList.length === 0) {

      }
    },
    addItem: function () {
      this.Items.push({itemid: 0, title: ''})
    },
    removeItem: function (index) {
      if (this.Items[index].itemid === 0) {
        this.deletedStore.push(index)
        // this.Items.splice(index, 1)
      } else {
        alert('not implemented api')
      }
    },
    restoreItem: function (paramIndex) {
      this.deletedStore.forEach((item, index) => {
        if (item === paramIndex) this.deletedStore.splice(index, 1)
      })
    },
    submitVote: function () {
      // todo: 투표정보가 있는가
      // todo: 제목이 있는가
      // todo: password
      let itemArray = []
      for (let item of this.Items) {
        itemArray.push({content: item.title})
      }
      this.registLoading = true
      this.$http.post(this.Const.API_URL.dev + `/votes`, {
        title: this.dataForm.title,
        password: this.dataForm.password,
        start_date: '', // TODO: 추후추가
        end_date: this.dataForm.options.endDatetime,
        max_count: this.dataForm.options.maxCount,
        items: itemArray
      })
        .then((response) => {
          console.log(response)
          console.log(response.data.vote.id)
          if (response.status === 201) {
            this.validated.isSuccessRegist = true
            this.$router.push({name: 'VotePage', params: {id: response.data.vote.id}})
          }
        }).catch((err) => {
          console.log(err)
          this.validated.isConnectError = true
        }).finally((response) => {
          console.log(response)
          if (this.validated.isConnectError) {
            this.callMessage('저희 본의는 아닌데 투표 생성 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', this.Const.MESSAGE_LEVEL.ERROR)
          } else if (this.validated.isSuccessRegist) {
            this.callMessage('투표가 생성되었습니다.', this.Const.MESSAGE_LEVEL.SUCCESS)
            // todo: 추후처리
          } else if (!this.validated.isSuccessRegist) {
            this.callMessage('어떤 이유인지, 회원 가입을 실패했습니다.. ', this.Const.MESSAGE_LEVEL.WARNING)
          }
          this.registLoading = false
        })
    },
    checkPassword: function () {
      if (this.dataForm.password === '') {
        this.callMessage('?? 패스워드가 없으면 로그인을 할 수가 없으세요!', this.Const.MESSAGE_LEVEL.WARNING)
        this.validated.password = false
      } else {
        this.validated.password = true
      }
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
  },
  mounted: function () {
    this.$nextTick(function () {
      console.log('mounted!')
      // todo: api call
      if (this.Items.length === 0) {
        this.modes.isInsertMode = true
        for (let cnt = 0; cnt < 3; cnt++) {
          this.Items.push({itemid: 0, title: ''})
        }
      }
    })
  },
  watch: {
    'deletedStore': function () {
      if (this.deletedStore.length > 0 && !this.guide.delete.isDisplayed) {
        this.$message({ message: this.guide.delete.msg, type: 'warning' })
        this.guide.delete.isDisplayed = true
      }
    }
  }
}
//
// new Vue({
//   el: '#vote-template',
//   data: {
//     newTodoText: '',
//     todos: [
//       {
//         id: 1,
//         title: 'Do the dishes'
//       },
//       {
//         id: 2,
//         title: 'Take out the trash'
//       },
//       {
//         id: 3,
//         title: 'Mow the lawn'
//       }
//     ],
//     nextTodoId: 4
//   },
//   methods: {
//     addNewTodo: function () {
//       this.todos.push({
//         id: this.nextTodoId++,
//         title: this.newTodoText
//       })
//       this.newTodoText = ''
//     }
//   }
// })
</script>

<style scoped>
  @import "../../scss/common.scss";
</style>
