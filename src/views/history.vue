<template>
  <div class="history-container">
    
    <div class="history-box">
      <div class="history-header">
        <h2 class="history-title">检测历史记录</h2>
        <p class="history-tip">查看您的历史检测记录</p>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
        <el-skeleton :rows="3" animated />
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 历史记录列表 -->
      <div v-else-if="logs.length > 0" class="history-content">
        <el-timeline>
          <el-timeline-item
            v-for="log in logs"
            :key="log.id"
            :timestamp="log.timestamp"
            placement="top"
            :type="getTimelineType(log)">
            <el-card class="log-card">
              <div class="log-header">
                <h4>检测记录 #{{ log.id }}</h4>
                <el-button 
                  type="text" 
                  @click="showLogDetail(log)"
                  icon="el-icon-view">
                  查看详情
                </el-button>
              </div>
              
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="系统架构">{{ log.processor_architecture }}</el-descriptions-item>
                <el-descriptions-item label="系统版本">{{ log.major_version }}</el-descriptions-item>
                <el-descriptions-item label="构建号">{{ log.build_number }}</el-descriptions-item>
                <el-descriptions-item label="文件">
                  <el-button 
                    type="text" 
                    @click="downloadFile(log.file_url)"
                    v-if="log.file_url">
                    <i class="el-icon-download"></i> 下载文件
                  </el-button>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 空状态 -->
      <el-empty 
        v-else 
        description="暂无检测记录"
        :image-size="200">
      </el-empty>
      
      <!-- 详情对话框 -->
      <el-dialog
        title="检测记录详情"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
        <div v-if="currentLog">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="检测时间">{{ currentLog.timestamp }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ currentLog.processor_architecture }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">{{ currentLog.major_version }}</el-descriptions-item>
            <el-descriptions-item label="构建号">{{ currentLog.build_number }}</el-descriptions-item>
            <el-descriptions-item label="加载模块" :span="2">
              <el-table :data="m" style="width: 100%" border>
                  <el-table-column prop="name" label="名称" align="center" />
                  <el-table-column prop="base_address" label="基地址" align="center" />
                  <el-table-column prop="size" label="大小" align="center" />
                  <el-table-column prop="timestamp" label="时间戳" align="center" />
                  <el-table-column prop="version" label="版本号" align="center" />
              </el-table>
            </el-descriptions-item>
            <el-descriptions-item label="线程信息" :span="2">
              <el-table :data="t" style="width: 100%" border>
                  <el-table-column prop="id" label="id" align="center" />
                  <el-table-column prop="suspend_count" label="线程数" align="center" />
                  <el-table-column prop="priority" label="优先级" align="center" />
                  <el-table-column prop="teb" label="堆栈" align="center" />
                  <el-table-column prop="stack_size" label="栈大小" align="center" />
              </el-table>
              
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'History',
  filters: {
    truncate(value, length) {
      if (!value) return ''
      if (value.length > length) {
        return value.substring(0, length) + '...'
      }
      return value
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
    username() {
      return this.currentUser ? this.currentUser.username : ''
    },
    t() {
      const jsonString = this.currentLog.threads.replace(/'/g, '"');
      return JSON.parse(jsonString)
    },
    m(){
      const jsonString = this.currentLog.modules.replace(/'/g, '"');
      return JSON.parse(jsonString)
    }
  },
  data() {
    return {
      logs: [],
      dialogVisible: false,
      currentLog: null,
      loading: false
    }
  },
  methods: {
    async fetchLogs() {
      this.loading = true
      try {
        const response = await axios.get(`http://127.0.0.1:8000/user-logs/?username=${this.username}`)
        if (response.data.error) {
          this.$message.error(response.data.error)
          return
        }
        this.logs = response.data.logs
      } catch (error) {
        console.error('获取检测记录失败:', error)
        let errorMsg = '获取检测记录失败'
        if (error.response && error.response.data && error.response.data.error) {
          errorMsg = error.response.data.error
        }
        this.$message.error(errorMsg)
      } finally {
        this.loading = false
      }
    },
    downloadFile(fileUrl) {
      if (!fileUrl) {
        this.$message.error('文件不存在')
        return
      }
      
      // 从文件URL中提取文件名
      const filename = fileUrl.split('/').pop()
      if (!filename) {
        this.$message.error('无效的文件名')
        return
      }
      
      // 创建下载链接
      const downloadUrl = `http://127.0.0.1:8000/download/${filename}/`
      
      // 创建一个临时的a标签来触发下载
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    showLogDetail(log) {
      this.currentLog = log
      this.dialogVisible = true
    },
    handleClose(done) {
      this.currentLog = null
      done()
    },
    getTimelineType(log) {
      // 根据检测结果返回不同的时间线类型
      if (log.confidence > 0.7) {
        return 'success'  // 良性概率高
      } else if (log['Malware Prob'] > 0.7) {
        return 'danger'   // 恶意概率高
      } else {
        return 'warning'  // 不确定
      }
    }
  },
  created() {
    if (this.username) {
      this.fetchLogs()
    }
  }
}
</script>

<style scoped>
.history-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px 0;
  background-color: #f5f7fa;
  margin-top: 60px;
}

.history-box {
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.history-header {
  text-align: center;
  margin-bottom: 40px;
}

.history-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.history-tip {
  font-size: 14px;
  color: #909399;
}

.history-content {
  margin-top: 20px;
}

.log-card {
  margin-bottom: 10px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.log-header h4 {
  margin: 0;
  color: #303133;
}

.el-timeline {
  padding-left: 20px;
}

.el-descriptions {
  margin-top: 15px;
}

.el-descriptions-item__label {
  width: 100px;
  background-color: #f5f7fa;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__body {
  padding: 30px 20px;
}

.loading-container {
  margin-top: 20px;
  padding: 20px;
}

.loading-container .el-skeleton {
  margin-bottom: 20px;
}
</style>

