<template>
  <user-layout page-title="修改密码" active-menu="change-password">
    <el-card class="change-password-card">
      <div class="card-header">
        <h3>修改密码</h3>
      </div>
      
      <el-form ref="changePasswordForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="当前密码" prop="old_password">
          <el-input 
            v-model="form.old_password" 
            placeholder="请输入当前密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item label="新密码" prop="new_password">
          <el-input 
            v-model="form.new_password" 
            placeholder="请输入新密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input 
            v-model="form.confirm_password" 
            placeholder="请再次输入新密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            class="submit-btn" 
            @click="submitForm('changePasswordForm')"
            :loading="loading"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </user-layout>
</template>

<script>
import { changePassword } from '@/api/auth'
import UserLayout from '@/components/user/UserLayout.vue'

export default {
  name: 'ChangePasswordPage',
  components: {
    UserLayout
  },
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
        old_password: '',
        new_password: '',
        confirm_password: ''
      },
      rules: {
        old_password: [
          { required: true, message: '请输入当前密码', trigger: 'blur' }
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
            const response = await changePassword({
              old_password: this.form.old_password,
              new_password: this.form.new_password,
              confirm_password: this.form.confirm_password
            })
            
            // 更新token
            if (response && response.token) {
              this.$store.commit('SET_TOKEN', response.token)
              
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              
              // 清空表单
              this.form.old_password = ''
              this.form.new_password = ''
              this.form.confirm_password = ''
              this.$refs[formName].resetFields()
            }
          } catch (error) {
            console.error('Change password error:', error)
            let errorMsg = '修改失败，请稍后重试'
            if (error.response && error.response.data && error.response.data.detail) {
              errorMsg = error.response.data.detail
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
.change-password-card {
  margin-bottom: 20px;
}

.card-header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.submit-btn {
  width: 100%;
}
</style> 