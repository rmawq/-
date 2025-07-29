<template>
  <el-card class="user-sidebar">
    <div class="user-avatar-container">
      <div class="avatar-wrapper">
        <img :src="userInfo.avatar_url || defaultAvatar" class="user-avatar" alt="用户头像">
        <div class="avatar-upload" v-if="activeMenu === 'profile'">
          <label for="avatar-upload" class="upload-label">
            <i class="el-icon-camera"></i>
            <span>更换头像</span>
          </label>
          <input 
            type="file" 
            id="avatar-upload" 
            class="upload-input" 
            accept="image/*"
            @change="handleAvatarUpload"
          >
        </div>
      </div>
      <h3 class="username">{{ userInfo.username || '445253369' }}</h3>
      <p class="user-meta" v-if="userInfo.location">
        <i class="el-icon-location-outline"></i> {{ userInfo.location }}
      </p>
      <p class="join-date">
        注册于 {{ formatDate(userInfo.date_joined) || '2025-04-01' }}
      </p>
    </div>
    
    <div class="sidebar-menu">
      <div class="menu-item" :class="{ active: activeMenu === 'profile' }" @click="goToPage('/profile')">
        <i class="el-icon-user"></i>
        <span>个人资料</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'change-password' }" @click="goToPage('/change-password')">
        <i class="el-icon-lock"></i>
        <span>修改密码</span>
      </div>
      <div class="menu-item" :class="{ active: activeMenu === 'orders' }" @click="goToPage('/orders')">
        <i class="el-icon-s-order"></i>
        <span>我的订单</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { uploadAvatar } from '@/api/user'

export default {
  name: 'UserSidebar',
  props: {
    activeMenu: {
      type: String,
      default: 'profile'
    }
  },
  data() {
    return {
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      loading: false
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    userInfo() {
      return this.currentUser || {}
    }
  },
  methods: {
    async handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.includes('image/')) {
        this.$message.error('请上传图片文件')
        return
      }
      
      // 验证文件大小（限制为2MB）
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('图片大小不能超过2MB')
        return
      }
      
      const formData = new FormData()
      formData.append('avatar', file)
      
      this.loading = true
      
      try {
        const response = await uploadAvatar(formData)
        
        // 更新store中的用户信息
        this.$store.commit('UPDATE_USER_PROFILE', response)
        
        this.$message({
          message: '头像上传成功',
          type: 'success'
        })
      } catch (error) {
        console.error('Avatar upload error:', error)
        this.$message.error('头像上传失败，请稍后重试')
      } finally {
        this.loading = false
        // 清空input，确保可以重复选择同一文件
        event.target.value = ''
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    goToPage(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>
.user-sidebar {
  margin-bottom: 20px;
}

.user-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
}

.avatar-wrapper:hover .avatar-upload {
  opacity: 1;
}

.upload-label {
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.upload-label i {
  margin-right: 5px;
}

.upload-input {
  display: none;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
  color: #333;
}

.user-meta {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.join-date {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.sidebar-menu {
  margin-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item i {
  margin-right: 10px;
  font-size: 16px;
}

.menu-item a {
  color: inherit;
  text-decoration: none;
}

.menu-item.active, .menu-item:hover {
  color: #FFA80A;
}
</style> 