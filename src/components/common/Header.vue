<template>
  <div class="header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <span class="logo-text">内存检测系统</span>
        </router-link>
      </div>
      <div class="nav">
        <router-link to="/" class="nav-item" :class="{ active: activeIndex === '0' }">首页</router-link>
        <router-link to="/hotels" class="nav-item" :class="{ active: activeIndex === '1' }">在线检测</router-link>
        <router-link to="/history" class="nav-item" :class="{ active: activeIndex === '2' }">检测记录</router-link>
        <a href="http://127.0.0.1:8000/admin/" class="nav-item" style="color: #333; font-size: 16px; text-decoration: none;">后台管理</a>

      </div>
      <div class="user-actions">
        <template v-if="isLoggedIn">
          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-avatar-container">
              <img :src="userAvatar" class="user-avatar" alt="用户头像" />
              <div class="user-info">
                <span class="username">{{ username }}</span>
                <span class="user-location" v-if="userLocation">{{ userLocation }}</span>
              </div>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="change_password">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      activeIndex: '0'
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
    isLoggedIn() {
      return this.isAuthenticated
    },
    username() {
      return this.currentUser ? this.currentUser.username : ''
    },
    userAvatar() {
      if (this.currentUser && this.currentUser.avatar_url) {
        return this.currentUser.avatar_url
      }
      // 默认头像
      return 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    },
    userLocation() {
      return this.currentUser && this.currentUser.location ? this.currentUser.location : '';
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      } else if (command === 'profile') {
        this.$router.push('/profile')
      } else if (command === 'orders') {
        this.$router.push('/orders')
      } else if (command === 'change_password') {
        this.$router.push('/change-password')
      }
    }
  },
  created() {
    const path = this.$route.path
    if (path === '/') this.activeIndex = '0'
    else if (path === '/hotels') this.activeIndex = '1'
    else if (path === '/history') this.activeIndex = '2'
    else if (path === '/profile') this.activeIndex = '3'
    else if (path === '/change-password') this.activeIndex = '4'
  }
}
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 60px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  height: 40px;
  display: flex;
  align-items: center;
}

.logo img {
  height: 30px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #FFA80A;
}

.nav {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-item {
  display: inline-block;
  padding: 0 15px;
  height: 60px;
  line-height: 60px;
  color: #333;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover, .nav-item.active {
  color: #FFA80A;
}

.user-actions {
  display: flex;
  align-items: center;
}

.login-btn, .register-btn {
  display: inline-block;
  padding: 0 15px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}

.login-btn:hover, .register-btn:hover {
  color: #FFA80A;
}

.el-dropdown-link {
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.el-dropdown-link:hover {
  color: #FFA80A;
}

.user-avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
  margin-right: 8px;
}

.username {
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
}

.user-location {
  font-size: 12px;
  color: #909399;
  line-height: 1.2;
  margin-top: 2px;
}
</style> 