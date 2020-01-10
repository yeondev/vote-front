<template>
  <div id="app">
    <el-container>
      <el-header>
        <VoteHeaderBar />
      </el-header>
      <el-main>
        <el-card body-style="max-width:1000px" align="center" class="box-card main-card">
          <router-view/>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import VoteHeaderBar from '@/components/vote/VoteHeaderBar'
export default {
  name: 'App',
  components: {
    VoteHeaderBar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
  position: fixed;
  width: 100%;
  height: 100%;
}

.box-card {
  width: 880px;
}

.main-card {
  position: relative;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  margin: auto;
}
</style>
