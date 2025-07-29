<template>
  <div class="register-container">
    <particle-background color="#FFA80A" :particle-count="150" :opacity="0.5" :speed="0.8" />
    <div class="register-box">
      <div class="register-header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="马蜂窝旅游" height="50">
          <h2 class="title">用户注册</h2>
        </div>
      </div>
      
      <el-form :model="registerForm" :rules="rules" ref="registerForm" class="register-form" size="medium">
        <el-form-item prop="username">
          <el-input 
            v-model="registerForm.username" 
            prefix-icon="el-icon-user" 
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input 
            v-model="registerForm.email" 
            prefix-icon="el-icon-message" 
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="registerForm.password" 
            prefix-icon="el-icon-lock" 
            placeholder="密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="confirm_password">
          <el-input 
            v-model="registerForm.confirm_password" 
            prefix-icon="el-icon-lock" 
            placeholder="确认密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="registerForm.agree_terms">
            我已阅读并同意<a href="#" class="terms-link">《服务条款》</a>和<a href="#" class="terms-link">《隐私政策》</a>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm('registerForm')" 
            :loading="loading" 
            class="register-button"
            :disabled="!registerForm.agree_terms"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="login-row">
          <span>已有账号？</span>
          <router-link to="/login" class="login-link">立即登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerApi } from '@/api/auth'
import ParticleBackground from '@/components/common/ParticleBackground.vue'

export default {
  name: 'Register',
  components: {
    ParticleBackground
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        agree_terms: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '用户名长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirm_password: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.registerForm.agree_terms) {
            this.$message.warning('请阅读并同意服务条款和隐私政策')
            return
          }
          
          this.loading = true
          
          try {
            await registerApi({
              username: this.registerForm.username,
              email: this.registerForm.email,
              password: this.registerForm.password,
              confirm_password: this.registerForm.confirm_password
            })
            
            this.$message({
              message: '注册成功，请登录',
              type: 'success'
            })
            
            // 跳转到登录页
            setTimeout(() => {
              this.$router.push('/login')
            }, 1500)
          } catch (error) {
            console.error('Registration error:', error)
            let errorMsg = '注册失败，请稍后重试'
            
            if (error.response && error.response.data) {
              // 处理后端返回的错误信息
              const errorData = error.response.data
              if (errorData.username) {
                errorMsg = `用户名错误: ${errorData.username[0]}`
              } else if (errorData.email) {
                errorMsg = `邮箱错误: ${errorData.email[0]}`
              } else if (errorData.password) {
                errorMsg = `密码错误: ${errorData.password[0]}`
              } else if (errorData.non_field_errors) {
                errorMsg = errorData.non_field_errors[0]
              }
            }
            
            this.$message.error(errorMsg)
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.register-box {
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  margin-top: 15px;
  font-size: 22px;
  color: #333;
  font-weight: 500;
}

.register-form {
  margin-top: 20px;
}

.terms-link {
  color: #FFA80A;
  text-decoration: none;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #FFA80A;
  border-color: #FFA80A;
}

.register-button:hover,
.register-button:focus {
  background-color: #ff9900;
  border-color: #ff9900;
}

.login-row {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #FFA80A;
  text-decoration: none;
  margin-left: 5px;
}
</style> 