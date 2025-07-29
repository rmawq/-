<template>
  <div class="register-form">
    <el-form ref="registerForm" :model="registerForm" :rules="rules" label-width="0px">
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
          placeholder="邮箱地址"
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
      
      <el-form-item prop="security_code">
        <el-input 
          v-model="registerForm.security_code" 
          prefix-icon="el-icon-key"
          placeholder="安全码（用于找回密码）" 
        ></el-input>
      </el-form-item>
      
      <el-form-item class="agreement-box" prop="agreement">
        <el-checkbox v-model="registerForm.agreement">
          我已阅读并同意
          <a href="javascript:;" class="agreement-link">用户协议</a>
          和
          <a href="javascript:;" class="agreement-link">隐私政策</a>
        </el-checkbox>
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          class="orange-btn submit-btn" 
          @click="submitForm('registerForm')"
          :loading="loading"
        >
          注 册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { register as registerApi } from '@/api/auth'

export default {
  name: 'Register',
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
        security_code: '',
        agreement: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
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
        ],
        security_code: [
          { required: true, message: '请输入安全码', trigger: 'blur' }
        ],
        agreement: [
          { 
            validator: (rule, value, callback) => {
              if (value === false) {
                callback(new Error('请阅读并同意用户协议和隐私政策'))
              } else {
                callback()
              }
            }, 
            trigger: 'change' 
          }
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
            // 调用API进行注册
            const response = await registerApi({
              username: this.registerForm.username,
              email: this.registerForm.email,
              password: this.registerForm.password,
              confirm_password: this.registerForm.confirm_password,
              security_code: this.registerForm.security_code
            })
            
            // 注册成功后自动登录
            if (response && response.token) {
              // 保存token到store
              this.$store.commit('SET_TOKEN', response.token)
              
              // 更新store中的用户信息
              this.$store.commit('SET_USER', response.user)
              
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.$router.push('/')
            }
          } catch (error) {
            console.error('Register error:', error)
            let errorMsg = '注册失败，请检查输入信息'
            if (error.response && error.response.data) {
              if (error.response.data.detail) {
                errorMsg = error.response.data.detail
              } else {
                // 尝试获取第一个字段错误
                const fields = Object.keys(error.response.data)
                if (fields.length > 0 && Array.isArray(error.response.data[fields[0]])) {
                  errorMsg = `${fields[0]}: ${error.response.data[fields[0]][0]}`
                }
              }
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
.register-form {
  padding: 30px;
}

.agreement-box {
  margin-bottom: 20px;
}

.agreement-link {
  color: #FFA80A;
  text-decoration: none;
}

.submit-btn {
  width: 100%;
  font-size: 16px;
  height: 40px;
}
</style> 