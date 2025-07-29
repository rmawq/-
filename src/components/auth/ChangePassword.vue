<template>
  <div class="change-password-form">
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
  </div>
</template>

<script>
import { changePassword } from '@/api/auth'

export default {
  name: 'ChangePassword',
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
.change-password-form {
  max-width: 500px;
  margin: 30px auto;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.submit-btn {
  width: 100%;
}
</style> 