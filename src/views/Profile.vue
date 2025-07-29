<template>
  <user-layout page-title="个人资料" active-menu="profile">
    <el-card class="profile-content">
      <div class="card-header">
        <h3>个人资料</h3>
      </div>
      
      <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="user-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="first_name">
              <el-input v-model="userForm.first_name" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="userForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="userForm.gender" placeholder="请选择" style="width: 100%;">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
                <el-option label="保密" value="保密"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="生日" prop="birth_date">
              <el-date-picker
                v-model="userForm.birth_date"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所在地" prop="location">
              <el-input v-model="userForm.location"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="个人网站" prop="website">
              <el-input v-model="userForm.website" placeholder="请输入网址">
                <template slot="prepend">http://</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="个人简介" prop="bio">
          <el-input 
            type="textarea" 
            v-model="userForm.bio" 
            :rows="4"
            placeholder="介绍一下自己吧"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm('userForm')" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </user-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import UserLayout from '@/components/user/UserLayout.vue'

export default {
  name: 'Profile',
  components: {
    UserLayout
  },
  data() {
    return {
      userForm: {
        username: '',
        email: '',
        first_name: '',
        phone: '',
        bio: '',
        birth_date: '',
        gender: '',
        location: '',
        website: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        website: [
          { type: 'url', message: '请输入正确的网址', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    userInfo() {
      return this.currentUser || {}
    }
  },
  watch: {
    currentUser: {
      handler(val) {
        if (val) {
          this.initUserForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    initUserForm() {
      this.userForm = {
        username: this.userInfo.username || '',
        email: this.userInfo.email || '',
        first_name: this.userInfo.first_name || '',
        phone: this.userInfo.phone || '',
        bio: this.userInfo.bio || '',
        birth_date: this.userInfo.birth_date || '',
        gender: this.userInfo.gender || '保密',
        location: this.userInfo.location || '',
        website: this.userInfo.website ? this.userInfo.website.replace(/^https?:\/\//, '') : ''
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          
          try {
            // 处理网站地址，确保有http://前缀
            let websiteValue = this.userForm.website
            if (websiteValue && !websiteValue.match(/^https?:\/\//)) {
              websiteValue = 'http://' + websiteValue
            }
            
            await this.$store.dispatch('updateProfile', {
              username: this.userForm.username,
              email: this.userForm.email,
              first_name: this.userForm.first_name,
              phone: this.userForm.phone,
              bio: this.userForm.bio,
              birth_date: this.userForm.birth_date,
              gender: this.userForm.gender,
              location: this.userForm.location,
              website: websiteValue
            })
            
            this.$message({
              message: '个人资料更新成功',
              type: 'success'
            })
          } catch (error) {
            console.error('Update profile error:', error)
            let errorMsg = '更新失败，请稍后重试'
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
        }
      })
    }
  },
  created() {
    // 确保有用户数据
    if (!this.currentUser) {
      this.$store.dispatch('fetchUserInfo')
    }
  }
}
</script>

<style scoped>
.profile-content {
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

.user-form {
  max-width: 100%;
}
</style> 