<template>
  <user-layout page-title="我的订单" active-menu="orders">
    <el-card class="orders-card">
      <div class="card-header">
        <h3>我的订单</h3>
      </div>
      
      <el-table
        v-loading="loading"
        :data="orderList"
        border
        style="width: 100%"
        :empty-text="emptyText"
      >
        <el-table-column
          prop="order_id"
          label="订单号"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="订单名称"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="120"
        >
          <template slot-scope="scope">
            <span>¥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              type="primary" 
              @click="viewOrderDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </user-layout>
</template>

<script>
import UserLayout from '@/components/user/UserLayout.vue'

export default {
  name: 'OrdersPage',
  components: {
    UserLayout
  },
  data() {
    return {
      loading: false,
      orderList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      emptyText: '暂无订单数据'
    }
  },
  methods: {
    getStatusType(status) {
      const statusMap = {
        '待付款': 'warning',
        '待发货': 'info',
        '已发货': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    },
    fetchOrders() {
      this.loading = true
      // 模拟获取订单数据
      setTimeout(() => {
        this.orderList = [
          {
            order_id: '202504010001',
            title: '三亚4日游',
            create_time: '2025-04-01 10:30:45',
            price: '2680.00',
            status: '已完成'
          },
          {
            order_id: '202504010002',
            title: '张家界森林公园门票',
            create_time: '2025-04-01 15:20:10',
            price: '248.00',
            status: '待付款'
          }
        ]
        this.total = this.orderList.length
        this.loading = false
      }, 1000)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchOrders()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchOrders()
    },
    viewOrderDetail(order) {
      this.$message.info(`查看订单: ${order.order_id}`)
      // 实际项目中应该跳转到订单详情页
      // this.$router.push(`/order/${order.order_id}`)
    }
  },
  created() {
    this.fetchOrders()
  }
}
</script>

<style scoped>
.orders-card {
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

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 