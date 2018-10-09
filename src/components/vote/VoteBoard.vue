<template>
  <div>
    <!-- TODO: 투표리스트 조회 후 표시 -->
    <span>만들어져있는 투표가 없습니다. 투표를 만들어볼까요!</span> <br>
    <router-link :to="urls.create">
      <el-button>투표 만들기</el-button>
    </router-link>

  </div>
</template>
<script>
import Urls from '@/components/source/parts/Urls'

export default {
  data () {
    return {
      name: 'VoteBoard',
      urls: {
        create: Urls.vote.create.path
      }
    }
  }
}
</script>
<style scoped>

</style>
