<template>
  <div class="forgot-password-page">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-content">
          <div class="auth-left">
            <div class="tab-header">
              <div class="tab-title">找回密码</div>
            </div>
            
            <ForgotPassword />
          </div>
          <div class="auth-right">
            <div class="app-download">
              <div class="app-logo">
                <div class="logo-box">M</div>
              </div>
              <div class="app-title">欢迎使用本系统</div>
              <div class="app-desc">使用之前，请先注册</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ForgotPassword from '@/components/auth/ForgotPassword.vue'

export default {
  name: 'ForgotPasswordPage',
  components: {
    ForgotPassword
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
}

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
  height: 50px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-title {
  color: #FFA80A;
  font-size: 18px;
  font-weight: 500;
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