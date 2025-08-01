<template>
  <div class="login-container">
    <particle-background color="#FFA80A" :particle-count="150" :opacity="0.5" :speed="0.8" />
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="" height="50">
          <h2 class="title">用户登录</h2>
        </div>
      </div>
      
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form" size="medium">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            prefix-icon="el-icon-user" 
            placeholder="用户名/手机号"
          ></el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            prefix-icon="el-icon-lock" 
            placeholder="密码" 
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <div class="remember-row">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <router-link to="/forgot-password" class="forget-link">忘记密码？</router-link>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')" :loading="loading" class="login-button">
            登录
          </el-button>
        </el-form-item>
        
        <div class="register-row">
          <span>还没有账号？</span>
          <router-link to="/register" class="register-link">立即注册</router-link>
        </div>
       
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ParticleBackground from '@/components/common/ParticleBackground.vue'

export default {
  name: 'Login',
  components: {
    ParticleBackground
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        remember: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名或手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    ...mapActions(['login']),
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          
          try {
            // 调用Vuex中的login action
            await this.login({
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            
            this.$message({
              message: '登录成功',
              type: 'success'
            })
            
            // 重定向到首页或之前页面
            const redirect = this.$route.query.redirect || '/'
            this.$router.push(redirect)
          } catch (error) {
            console.error('Login error:', error)
            this.$message.error('登录失败，请检查用户名和密码')
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.login-box {
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.login-header {
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

.login-form {
  margin-top: 20px;
}

.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forget-link {
  font-size: 14px;
  color: #409EFF;
  text-decoration: none;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  background-color: #FFA80A;
  border-color: #FFA80A;
}

.login-button:hover,
.login-button:focus {
  background-color: #ff9900;
  border-color: #ff9900;
}

.register-row {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link {
  color: #FFA80A;
  text-decoration: none;
  margin-left: 5px;
}

.third-party-login {
  margin-top: 30px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #eee;
}

.divider-text {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  background-color: #fff;
  color: #999;
  font-size: 12px;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.other-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s;
}

.other-icon:hover {
  transform: scale(1.1);
}

.weibo {
  background-color: #f6f6f6;
  background-image: url('data:image/svg+xml;utf8,<svg t="1711007500" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1456" width="24" height="24"><path d="M851.4 590.193c-22.196-66.233-90.385-90.422-105.912-91.863-15.523-1.442-29.593-9.94-19.295-27.505 10.302-17.566 29.304-68.684-7.248-104.681-36.564-36.14-116.512-22.462-173.094 0.866-56.434 23.327-53.39 7.055-51.65-8.925 1.89-16.848 32.355-111.02-60.791-122.395C311.395 220.86 154.85 370.754 99.572 457.15 16 587.607 29.208 675.873 29.208 675.873h0.58c10.009 121.819 190.787 218.869 412.328 218.869 190.5 0 350.961-71.853 398.402-169.478 0 0 0.143-0.433 0.575-1.156 4.938-10.506 8.71-21.168 11.035-32.254 6.668-26.205 11.755-64.215-0.728-101.66z m-436.7 251.27c-157.71 0-285.674-84.095-285.674-187.768 0-103.671 127.82-187.76 285.674-187.76 157.705 0 285.673 84.089 285.673 187.76 0 103.815-127.968 187.768-285.673 187.768z" fill="%23E71F19" p-id="1457"></path><path d="M803.096 425.327c2.896 1.298 5.945 1.869 8.994 1.869 8.993 0 17.7-5.328 21.323-14.112 5.95-13.964 8.993-28.793 8.993-44.205 0-62.488-51.208-113.321-114.181-113.321-15.379 0-30.32 3.022-44.396 8.926-11.755 4.896-17.263 18.432-12.335 30.24 4.933 11.662 18.572 17.134 30.465 12.238 8.419-3.46 17.268-5.33 26.41-5.33 37.431 0 67.752 30.241 67.752 67.247 0 9.068-1.735 17.857-5.369 26.202a22.832 22.832 0 0 0 12.335 30.236l0.01 0.01z" fill="%23F5AA15" p-id="1458"></path><path d="M726.922 114.157c-25.969 0-51.65 3.744-76.315 10.942-18.423 5.472-28.868 24.622-23.5 42.91 5.509 18.29 24.804 28.657 43.237 23.329a201.888 201.888 0 0 1 56.578-8.064c109.253 0 198.189 88.271 198.189 196.696 0 19.436-2.905 38.729-8.419 57.16-5.508 18.289 4.79 37.588 23.212 43.053 3.342 1.014 6.817 1.442 10.159 1.442 14.943 0 28.725-9.648 33.37-24.48 7.547-24.906 11.462-50.826 11.462-77.175-0.143-146.588-120.278-265.813-267.973-265.813z" fill="%23F5AA15" p-id="1459"></path><path d="M388.294 534.47c-84.151 0-152.34 59.178-152.34 132.334 0 73.141 68.189 132.328 152.34 132.328 84.148 0 152.337-59.182 152.337-132.328 0-73.15-68.19-132.334-152.337-132.334zM338.53 752.763c-29.454 0-53.39-23.755-53.39-52.987 0-29.228 23.941-52.989 53.39-52.989 29.453 0 53.39 23.76 53.39 52.989 0 29.227-23.937 52.987-53.39 52.987z m99.82-95.465c-6.382 11.086-19.296 15.696-28.726 10.219-9.43-5.323-11.75-18.717-5.37-29.803 6.386-11.09 19.297-15.7 28.725-10.224 9.43 5.472 11.755 18.864 5.37 29.808z" fill="%23040000" p-id="1460"></path></svg>');
  background-repeat: no-repeat;
  background-position: center center;
}

.qq {
  background-color: #f6f6f6;
  background-image: url('data:image/svg+xml;utf8,<svg t="1711007544" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1625" width="24" height="24"><path d="M511.09761 957.257c-80.159 0-153.737-25.019-201.11-62.386-24.057 6.702-54.831 17.489-74.252 30.864-16.617 11.439-14.546 23.106-11.55 27.816 13.15 20.689 225.583 13.211 286.912 6.767v-3.061z" fill="%23FAAD08" p-id="1626"></path><path d="M496.65061 957.257c80.157 0 153.737-25.019 201.11-62.386 24.057 6.702 54.83 17.489 74.253 30.864 16.616 11.439 14.543 23.106 11.55 27.816-13.15 20.689-225.584 13.211-286.914 6.767v-3.061z" fill="%23FAAD08" p-id="1627"></path><path d="M497.12861 474.524c131.934-0.876 237.669-25.783 273.497-35.34 8.541-2.28 13.11-6.364 13.11-6.364 0.03-1.172 0.542-20.952 0.542-31.155C784.27761 229.833 701.12561 57.173 496.64061 57.162 292.15661 57.173 209.00061 229.832 209.00061 401.665c0 10.203 0.516 29.983 0.547 31.155 0 0 3.717 3.821 10.529 5.67 33.078 8.98 140.803 35.139 276.08 36.034h0.972z" fill="%23000000" p-id="1628"></path><path d="M860.28261 619.782c-8.12-26.086-19.204-56.506-30.427-85.72 0 0-6.456-0.795-9.718 0.148-100.71 29.205-222.773 47.818-315.792 46.695h-0.962C410.88561 582.017 289.65061 563.617 189.27961 534.698 185.44461 533.595 177.87261 534.063 177.87261 534.063 166.64961 563.276 155.56661 593.696 147.44761 619.782 108.72961 744.168 121.27261 795.644 130.82461 796.798c20.496 2.474 79.78-93.637 79.78-93.637 0 97.66 88.324 247.617 290.576 248.996a718.01 718.01 0 0 1 5.367 0C708.80161 950.778 797.12261 800.822 797.12261 703.162c0 0 59.284 96.111 79.783 93.637 9.55-1.154 22.093-52.63-16.623-177.017" fill="%2300AEEC" p-id="1629"></path><path d="M434.38261 316.917c-27.9 1.24-51.745-30.106-53.24-69.956-1.518-39.877 19.858-73.207 47.764-74.454 27.875-1.224 51.703 30.109 53.218 69.974 1.527 39.877-19.853 73.2-47.742 74.436m206.67-69.956c-1.494 39.85-25.34 71.194-53.24 69.956-27.888-1.238-49.269-34.559-47.742-74.435 1.513-39.868 25.341-71.201 53.216-69.974 27.909 1.247 49.285 34.576 47.767 74.453" fill="%23FFFFFF" p-id="1630"></path><path d="M683.94261 368.627c-7.323-17.609-81.062-37.227-172.353-37.227h-0.98c-91.29 0-165.031 19.618-172.352 37.227a6.244 6.244 0 0 0-0.535 2.505c0 1.269 0.393 2.414 1.006 3.386 6.168 9.765 88.054 58.018 171.882 58.018h0.98c83.827 0 165.71-48.25 171.881-58.016a6.352 6.352 0 0 0 1.002-3.395c0-0.897-0.2-1.736-0.531-2.498" fill="%23FAAD08" p-id="1631"></path><path d="M467.63161 256.377c1.26 15.886-7.377 30-19.266 31.542-11.907 1.544-22.569-10.083-23.836-25.978-1.243-15.895 7.381-30.008 19.25-31.538 11.927-1.549 22.607 10.088 23.852 25.974m73.097 7.935c2.533-4.118 19.827-25.77 55.62-17.886 9.401 2.07 13.75 5.116 14.668 6.316 1.355 1.77 1.726 4.29 0.352 7.684-2.722 6.725-8.338 6.542-11.454 5.226-2.01-0.85-26.94-15.889-49.905 6.553-1.579 1.545-4.405 2.074-7.085 0.242-2.678-1.834-3.786-5.553-2.196-8.135" fill="%23000000" p-id="1632"></path><path d="M504.33261 584.495h-0.967c-63.568 0.752-140.646-7.504-215.286-21.92-6.391 36.262-10.25 81.838-6.936 136.196 8.37 137.384 91.62 223.736 220.118 224.996H506.48461c128.498-1.26 211.748-87.612 220.12-224.996 3.314-54.362-0.547-99.938-6.94-136.203-74.654 14.423-151.745 22.684-215.332 21.927" fill="%23FFFFFF" p-id="1633"></path><path d="M323.27461 577.016v137.468s64.957 12.705 130.031 3.91V591.59c-41.225-2.262-85.688-7.304-130.031-14.574" fill="%23EB1C26" p-id="1634"></path><path d="M788.09761 432.536s-121.98 40.387-283.743 41.539h-0.962c-161.497-1.147-283.328-41.401-283.743-41.539l-40.854 106.952c102.87 32.227 224.391 47.631 324.601 47.054h0.96c100.226 0.577 221.735-14.827 324.606-47.054l-40.865-106.952z" fill="%23EB1C26" p-id="1635"></path></svg>');
  background-repeat: no-repeat;
  background-position: center center;
}

.wechat {
  background-color: #f6f6f6;
  background-image: url('data:image/svg+xml;utf8,<svg t="1711007574" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1809" width="24" height="24"><path d="M1010.8 628c0-141.2-141.3-256.2-299.9-256.2-168 0-300.3 115.1-300.3 256.2 0 141.4 132.3 256.2 300.3 256.2 35.2 0 70.7-8.9 106-17.7l96.8 53-26.6-88.2c70.9-53.2 123.7-124 123.7-203.3zM618 588.8c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40c0 22-17.9 40-40 40z m194.3-0.3c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" fill="%2309BB07" p-id="1810"></path><path d="M366.5 106.2c-194.1 0-353.3 132.3-353.3 300.3 0 97 52.9 176.6 141.3 238.5l-35.2 106.2 123.4-61.9c44.1 8.9 79.5 18 123.9 18 11.1 0 22.1-0.5 33-1.4-6.9-23.6-10.9-48.3-10.9-74 0-154.3 132.5-279.5 300.2-279.5 11.5 0 22.8 0.8 34 2.1C692 212.8 539.9 106.2 366.5 106.2zM247.7 349.2c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z m238.6 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" fill="%2309BB07" p-id="1811"></path></svg>');
  background-repeat: no-repeat;
  background-position: center center;
}
</style> 