<template>
  <div class="home-container">
    <particle-background color="#FFA80A" :particle-count="150" :opacity="0.3" :speed="0.5" />
    <div class="banner">
      <div class="banner-content">
        <h1 class="title">内存检测系统</h1>
        <p class="subtitle">快速分析您的内存文件</p>
        <div class="quick-actions">
          <el-button type="warning" @click="$router.push('/hotels')" round>
            <i class="el-icon-upload"></i> 立即上传检测
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="container">
      <section class="popular-destinations">
        <div class="section-header">
          <h2 class="section-title">快速导航</h2>
          <router-link to="/destinations" class="view-more">
            查看更多 <i class="el-icon-arrow-right"></i>
          </router-link>
        </div>
        
        <el-row :gutter="20">
          <el-col :xs="12" :sm="10" :md="8" v-for="dest in popularDestinations" :key="dest.id">
            <div class="destination-card">
              <div class="card-image">
                <img :src="dest.image" :alt="dest.name">
                <div class="overlay">
                  <router-link :to="dest.route" class="view-button">
                    查看详情
                  </router-link>
                </div>
              </div>
              <div class="card-content">
                <h3 class="card-title">{{ dest.name }}</h3>
                <p class="card-description">{{ dest.description }}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </section>
    </div>
    
    <div class="floating-button" @click="$router.push('/hotels')">
      <i class="el-icon-upload"></i>
    </div>
  </div>
</template>

<script>
import ParticleBackground from '@/components/common/ParticleBackground.vue'

export default {
  name: 'Home',
  components: {
    ParticleBackground
  },
  data() {
    return {
      searchQuery: '',
      popularDestinations: [
        {
          id: 1,
          name: '个人资料',
          description: '查看与管理您的个人信息',
          image: '/1.jpeg',
          route: '/profile'
        },
        {
          id: 2,
          name: '在线检测',
          description: '上传你的内存文件开始预测',
          image: '/2.jpeg',
          route: '/hotels'
        },
        {
          id: 3,
          name: '历史记录',
          description: '查看您的检测历史记录',
          image: '/3.png',
          route: '/history'
        }
      ],
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchQuery.trim()) return
      
      this.$message.info(`正在搜索: ${this.searchQuery}`)
      // 实际项目中应该跳转到搜索结果页
      // this.$router.push(`/search?q=${encodeURIComponent(this.searchQuery)}`)
    }
  }
}
</script>

<style scoped>
.home-container {
  position: relative;
}
a{
  text-decoration: none;  
}
.banner {
  height: 500px;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('/home-bg.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}

.banner-content {
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.title {
  font-size: 42px;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 20px;
  margin-bottom: 30px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.quick-actions {
  margin-bottom: 25px;
}

.quick-actions .el-button {
  font-size: 16px;
  padding: 12px 25px;
  box-shadow: 0 2px 6px rgba(255, 168, 10, 0.4);
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #FFA80A;
}

.view-more {
  color: #FFA80A;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.view-more i {
  margin-left: 5px;
}

/* 目的地卡片样式 */
.destination-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.5s;
}

.destination-card:hover .card-image img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.destination-card:hover .overlay {
  opacity: 1;
}

.view-button {
  background-color: #FFA80A;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s;
}

.view-button:hover {
  background-color: #ff9900;
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 10px;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 旅行卡片样式 */
.tour-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tour-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.tour-card .card-image img {
  height: 220px;
}

.tour-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FFA80A;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.tour-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.tour-rating {
  color: #FFA80A;
}

.tour-price {
  margin: 10px 0 0;
  font-size: 14px;
  color: #666;
}

.price {
  font-size: 20px;
  color: #ff6600;
  font-weight: bold;
}

.price-text {
  font-size: 14px;
  color: #999;
  margin-left: 5px;
}

/* 攻略卡片样式 */
.guide-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.guide-card .card-image img {
  height: 200px;
}

.guide-excerpt {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-author {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-name {
  font-size: 14px;
  color: #666;
}

.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: #FFA80A;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
}

.floating-button i {
  font-size: 24px;
}

.floating-button:hover {
  transform: scale(1.1);
  background-color: #ff9900;
}
</style> 