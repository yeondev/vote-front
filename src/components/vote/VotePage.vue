<style scoped>
  .deletedInput >>> .el-input__inner {
    text-decoration: line-through;
  }
</style>
<!-- TODO: LAYOUT 조정 -->
<template>
  <div>
    <h2>투표하기</h2>
        <el-card align="left">
        <ul>
          <el-row>
            <el-col :span="10">
              <span> {{ dataForm.title }}</span>
            </el-col>
          </el-row>
        </ul>
        </el-card>

        <el-card align="left">
          <div style="margin-top: 5px"
               v-for="item in Items"
               v-bind:key="item.itemid"
               v-bind:content="item.content">
            <el-checkbox v-model="item.voted" border size="medium">{{item.content}}</el-checkbox>
          </div>
        </el-card>

        <el-card>
        <ul>
          <el-row :gutter="10" align="middle">
            {{ dataForm.options.endDatetime }}
          </el-row>
        </ul>

        <ul>
          <el-row :gutter="10" align="middle">
            {{ dataForm.options.maxCount}}
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
    <div class="form-group">
      <el-button @click="submitVote()">투표한다</el-button>
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
      guide: {
        delete: {
          msg: '삭제한 항목은 하단 적용버튼을 클릭한 후 적용됩니다. :)',
          isDisplayed: false
        }
      },
      validated: {
        title: false,
        password: false,
        isConnectError: false
      },
      Const: { // todo: move to const
        SUCCESS: 'success',
        WARNING: 'warning',
        ERROR: 'error'
      },
      registLoading: false,
      deletedStore: [],
      Items: []
    }
  },
  methods: {
    getItemList: function () {
      this.$http.get(`http://192.168.0.6:3000/api/v1/votes/` + this.$route.params['id'])
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            for (let item of response.data.vote.items) {
              this.Items.push({itemid: item.id, content: item.content, voted: item.voted})
            }
            this.dataForm.title = response.data.vote.title
          }
        }).catch((err) => {
          console.log(err)
          this.validated.isConnectError = true
        }).finally((response) => {
          console.log(response)
          if (this.validated.isConnectError) {
            this.callMessage('저희 본의는 아닌데 이메일 확인 시도 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', this.Const.ERROR)
          }
        })

      if (this.Items.length === 0) {

      }
    },
    addItem: function () {
      this.Items.push({itemid: 0, content: ''})
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
      let itemArray = []
      for (let item of this.Items) {
        if (item.voted) {
          itemArray.push(item.itemid)
        }
      }
      this.registLoading = true
      this.$http.post(`http://192.168.0.6:3000/api/v1/votes/` + this.$route.params['id'] + `/do`, {
        item_ids: itemArray
      })
        .then((response) => {
          if (response.status === 201) {
            this.validated.isSuccessRegist = true
          }
        }).catch((err) => {
          console.log(err)
          this.validated.isConnectError = true
        }).finally((response) => {
          console.log(response)
          if (this.validated.isConnectError) {
            this.callMessage('저희 본의는 아닌데 투표 처리 중에 에러가 발생했어요. 잠시 후에 다시 해보면 될 지도 모르는데 계속 안되면 운영자에게 문의해보시겠어요? ', this.Const.ERROR)
          } else if (this.validated.isSuccessRegist) {
            this.callMessage('투표가 완료되었습니다.', this.Const.SUCCESS)
          // todo: 추후처리
          } else if (!this.validated.isSuccessRegist) {
            this.callMessage('어떤 이유인지, 투표에 실패하였습니다.. ', this.Const.WARNING)
          }
          this.registLoading = false
        })
    },
    callMessage: function (message, pattern) {
      if (pattern === this.Const.ERROR) {
        this.$message.error(message)
      } else {
        this.$message({
          message: message, type: pattern
        })
      }
    }
  },
  props: ['id'],
  mounted: function () {
    console.log('mounted!')
    this.getItemList()
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
