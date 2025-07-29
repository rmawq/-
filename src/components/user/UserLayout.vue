<template>
  <div class="user-center-container">
    <particle-background color="#FFA80A" :particle-count="100" :opacity="0.4" />
    <div class="container">
      <div class="page-header">
        <h2 class="page-title">{{ pageTitle }}</h2>
      </div>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <user-sidebar :active-menu="activeMenu" />
        </el-col>
        
        <el-col :span="18">
          <slot></slot>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import UserSidebar from '@/components/user/UserSidebar.vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'

export default {
  name: 'UserLayout',
  components: {
    UserSidebar,
    ParticleBackground
  },
  props: {
    pageTitle: {
      type: String,
      default: '个人中心'
    },
    activeMenu: {
      type: String,
      default: 'profile'
    }
  }
}
</script>

<style scoped>
.user-center-container {
  padding-top: 80px;
  padding-bottom: 40px;
  position: relative;
  min-height: 100vh;
  background-color: rgba(250, 250, 250, 0.8);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #FFA80A;
}
</style> 