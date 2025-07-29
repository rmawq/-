<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="auth-content">
        <div class="auth-left">
          <div class="tab-header">
            <div 
              class="tab-item" 
              :class="{ active: !isLogin }"
              @click="handleTabClick('register')"
            >
              {{ isLogin ? '注册账号' : '注册账号' }}
            </div>
            <div 
              class="tab-item" 
              :class="{ active: isLogin }"
              @click="handleTabClick('login')"
            >
              密码登录
            </div>
          </div>
          
          <component :is="currentComponent"></component>
        </div>
        <div class="auth-right">
          <div class="app-download">
            <div class="app-logo">
              <div class="logo-box">S</div>
            </div>
            <div class="app-title">欢迎使用本系统</div>
            <div class="app-desc">使用之前，请先注册</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from '@/components/auth/Login.vue'
import Register from '@/components/auth/Register.vue'

export default {
  name: 'Auth',
  components: {
    Login,
    Register
  },
  props: {
    isLogin: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentComponent() {
      return this.isLogin ? 'Login' : 'Register'
    }
  },
  methods: {
    handleTabClick(tab) {
      if (tab === 'register') {
        this.$router.push('/register')
      } else if (tab === 'login') {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f8fa, #d7e3ec);
  background-size: cover;
  background-position: center;
}

.auth-box {
  width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.auth-content {
  display: flex;
}

.auth-left {
  flex: 1;
  padding: 0;
  border-right: 1px solid #f0f0f0;
}

.auth-right {
  width: 320px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #fafafa, #f2f6f9);
}

.tab-header {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: #FFA80A;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background-color: #FFA80A;
}

.app-download {
  text-align: center;
  padding: 20px;
}

.app-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-box {
  width: 80px;
  height: 80px;
  background-color: #FFD000;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: #333;
}

.app-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.app-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}
</style> 