<template>
  <div class="forgot-password-form">
    <el-form ref="forgotPasswordForm" :model="form" :rules="rules" label-width="0">
      <el-form-item prop="username">
        <el-input 
          v-model="form.username" 
          prefix-icon="el-icon-user"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      
      <el-form-item prop="security_code">
        <el-input 
          v-model="form.security_code" 
          prefix-icon="el-icon-key"
          placeholder="安全码"
        ></el-input>
      </el-form-item>
      
      <el-form-item prop="new_password">
        <el-input 
          v-model="form.new_password" 
          prefix-icon="el-icon-lock"
          placeholder="新密码" 
          show-password
        ></el-input>
      </el-form-item>
      
      <el-form-item prop="confirm_password">
        <el-input 
          v-model="form.confirm_password" 
          prefix-icon="el-icon-lock"
          placeholder="确认新密码" 
          show-password
        ></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          class="orange-btn submit-btn" 
          @click="submitForm('forgotPasswordForm')"
          :loading="loading"
        >
          重置密码
        </el-button>
      </el-form-item>
      
      <div class="form-footer">
        <router-link to="/login" class="link">返回登录</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { resetPassword } from '@/api/auth'

export default {
  name: 'ForgotPassword',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    
    return {
      form: {
        username: '',
        security_code: '',
        new_password: '',
        confirm_password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        security_code: [
          { required: true, message: '请输入安全码', trigger: 'blur' }
        ],
        new_password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
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
          this.loading = true
          
          try {
            const response = await resetPassword(this.form)
            
            // 密码重置成功
            if (response && response.token) {
              // 保存token
              this.$store.commit('SET_TOKEN', response.token)
              
              this.$message({
                message: '密码重置成功，请使用新密码登录',
                type: 'success'
              })
              
              // 重定向到登录页
              this.$router.push('/login')
            }
          } catch (error) {
            console.error('Reset password error:', error)
            let errorMsg = '密码重置失败，请检查输入信息'
            if (error.response && error.response.data && error.response.data.detail) {
              errorMsg = error.response.data.detail
            }
            this.$message.error(errorMsg)
          } finally {
            this.loading = false
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.forgot-password-form {
  padding: 30px;
}

.submit-btn {
  width: 100%;
  font-size: 16px;
  height: 40px;
  background-color: #ffa800;
  border-color: #ffa800;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.link {
  color: #666;
  text-decoration: none;
}

.link:hover {
  color: #ffa800;
}
</style> 