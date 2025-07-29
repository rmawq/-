<template>
  <div class="upload-container">
    <!-- 上传区域 -->
    <div class="upload-box">
      <div class="upload-header">
        <h2 class="upload-title">文件安全检测</h2>
        <p class="upload-tip">上传可疑文件进行安全分析</p>
      </div>
      <div style="display: flex;justify-content: center;width: 100%;">
        <el-upload class="upload-demo" action="http://127.0.0.1:8000/detect/" :on-success="handleSuccess" multiple
          :limit="1" :file-list="fileList" :data="{ username: username }" drag>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">支持上传.exe/.dll/.js等可执行文件，大小不超过50MB</div>
        </el-upload>
      </div>
    </div>
    <!-- 结果展示区域 -->
    <div class="result-box" v-if="isResult">
      <h3 class="result-title">检测结果</h3>
      <div class="result-content">
        <!-- 检测记录信息 -->
        <div class="log-info" v-if="logData">
          <h4>检测记录</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="检测时间">{{ logData.timestamp }}</el-descriptions-item>
            <el-descriptions-item label="系统架构">{{ logData.processor_architecture }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">{{ logData.major_version }}</el-descriptions-item>
            <el-descriptions-item label="构建号">{{ logData.build_number }}</el-descriptions-item>
            <el-descriptions-item label="线程信息" :span="2">
              <el-table :data="logData.threads" style="width: 100%" border>
                  <el-table-column prop="id" label="id" align="center" />
                  <el-table-column prop="suspend_count" label="线程数" align="center" />
                  <el-table-column prop="priority" label="优先级" align="center" />
                  <el-table-column prop="teb" label="堆栈" align="center" />
                  <el-table-column prop="stack_size" label="栈大小" align="center" />
              </el-table>
            </el-descriptions-item>
            <el-descriptions-item label="加载模块" :span="2">
              <el-button type="text" @click="showThreadInfo">查看线程详情</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 检测结果表格 -->
        <div class="detect-result">
          <h4>检测结果</h4>
          <el-table :data="data" style="width: 100%" stripe>
            <el-table-column prop="sha256" label="文件指纹" width="220" align="center">
              <template slot-scope="scope">
                <el-tooltip effect="dark" :content="scope.row.sha256" placement="top">
                  <span>{{ scope.row.sha256 | truncate(10) }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="检测结果" width="120" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row['Malware Prob'] > 0.5 ? 'danger' : 'success'">
                  {{ scope.row['Malware Prob'] > 0.5 ? '恶意程序' : '正常程序' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="confidence" label="正常概率" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ (scope.row.confidence * 100).toFixed(2) }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="Malware Prob" label="恶意概率" width="120" align="center">
              <template slot-scope="scope">
                <span>{{ (scope.row['Malware Prob'] * 100).toFixed(2) }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 添加线程信息对话框 -->
    <el-dialog
      title="线程详细信息"
      :visible.sync="threadDialogVisible"
      width="80%">
      <div v-if="parsedThreads.length > 0">
        <el-table :data="parsedThreads" style="width: 100%" border>
          <el-table-column prop="name" label="模块名称" min-width="250">
            <template slot-scope="scope">
              <div class="module-name">
                <el-tooltip effect="dark" :content="scope.row.name" placement="top">
                  <span>{{ scope.row.name | truncate(40) }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="base_address" label="基址" width="150" align="center" />
          <el-table-column prop="size" label="大小" width="120" align="center">
            <template slot-scope="scope">
              {{ formatSize(scope.row.size) }}
            </template>
          </el-table-column>
          <el-table-column prop="timestamp" label="时间戳" width="150" align="center">
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="120" align="center" />
        </el-table>
      </div>
      <div v-else class="no-thread-info">
        <el-empty description="无法解析线程信息"></el-empty>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="threadDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "hotels",
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
  },
  data() {
    return {
      pid: '',
      isResult: false,
      data: [],
      fileList: [],
      logData: null,
      threadDialogVisible: false,
      parsedThreads: []
    };
  },
  methods: {
    handleSuccess(response) {
      this.isResult = true
      this.data = response.result
      this.logData = response.log
      console.log(this.logData)
    },
    showThreadInfo() {
      if (this.logData && this.logData.modules) {
        try {
          // 尝试解析线程信息
          this.parsedThreads = this.parseThreadInfo(this.logData.modules)
          this.threadDialogVisible = true
        } catch (e) {
          console.error('解析线程信息出错:', e)
          this.$message.error('线程信息解析失败')
        }
      } else {
        this.$message.error('线程信息不可用')
      }
    },
    parseThreadInfo(threadsData) {
      // 如果是字符串，尝试解析为JSON
      if (typeof threadsData === 'string') {
        try {
          return JSON.parse(threadsData)
        } catch (e) {
          console.error('JSON解析失败:', e)
          return []
        }
      }
      
      // 如果已经是数组，直接返回
      if (Array.isArray(threadsData)) {
        return threadsData
      }
      
      return []
    },
    formatSize(sizeInBytes) {
      if (!sizeInBytes && sizeInBytes !== 0) return 'N/A'
      
      const kb = sizeInBytes / 1024
      if (kb < 1024) {
        return `${kb.toFixed(2)} KB`
      }
      
      const mb = kb / 1024
      if (mb < 1024) {
        return `${mb.toFixed(2)} MB`
      }
      
      const gb = mb / 1024
      return `${gb.toFixed(2)} GB`
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return 'N/A'
      
      try {
        // 转换unix时间戳为日期
        const date = new Date(timestamp * 1000)
        return date.toLocaleString()
      } catch (e) {
        return timestamp.toString()
      }
    }
  }
};
</script>

<style scoped>
.upload-container {
  width: 100%;
  min-height: 100vh;
  padding: 40px 0;
  background-color: #f5f7fa;
  margin-top: 60px;
}

.upload-box {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.upload-header {
  text-align: center;
  margin-bottom: 30px;
}

.upload-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.upload-tip {
  font-size: 14px;
  color: #909399;
}

.result-box {
  width: 80%;
  max-width: 800px;
  margin: 30px auto 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.result-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.result-content {
  margin-top: 20px;
}

.el-progress {
  margin-bottom: 5px;
}

.log-info {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.log-info h4 {
  margin-bottom: 15px;
  color: #303133;
}

.detect-result {
  margin-top: 30px;
}

.detect-result h4 {
  margin-bottom: 15px;
  color: #303133;
}

.el-descriptions {
  margin-top: 15px;
}

.el-descriptions-item__label {
  width: 120px;
  background-color: #f5f7fa;
}

/* 线程信息样式 */
.module-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-thread-info {
  padding: 20px;
  text-align: center;
}

.el-dialog {
  max-width: 1200px;
}
</style>
