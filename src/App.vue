<template>
  <div id="app">
    <Header v-if="!isAuthPage" />
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  computed: {
    isAuthPage() {
      return this.$route.path === '/login' || this.$route.path === '/register'
    }
  },
  created() {
    // 初始化认证状态
    this.$store.dispatch('initAuth')
  }
}
</script>

<style>
#app {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  position: relative;
}
</style> 