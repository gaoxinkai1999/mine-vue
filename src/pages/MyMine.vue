<template>
  <div class="header">
    <h1 class="title">门店配送系统</h1>
    <p class="version">版本 1.0.0</p>
  </div>
  <div class="statistics-dashboard">

    <!-- 数据卡片组 -->
    <div class="stats-groups">
      <!-- 今日数据 -->
      <div v-if="today" class="stats-card">
        <div class="card-header">
          <h3 class="card-title">今日数据</h3>
          <span class="date-tag">{{ formatDate(new Date()) }}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <van-icon class="stat-icon" name="orders-o"/>
            <div class="stat-content">
              <div class="stat-label">订单数</div>
              <div class="stat-value">{{ formatNumber(today.orderCount) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="gold-coin-o"/>
            <div class="stat-content">
              <div class="stat-label">销售额</div>
              <div class="stat-value">¥{{ today.totalSales }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="chart-trending-o"/>
            <div class="stat-content">
              <div class="stat-label">总利润</div>
              <div class="stat-value">¥{{ formatMoney(today.totalProfit) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 昨日数据 -->
      <div v-if="yesterday" class="stats-card">
        <div class="card-header">
          <h3 class="card-title">昨日数据</h3>
          <span class="date-tag">{{ formatDate(getYesterday()) }}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <van-icon class="stat-icon" name="orders-o"/>
            <div class="stat-content">
              <div class="stat-label">订单数</div>
              <div class="stat-value">{{ formatNumber(yesterday.orderCount) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="gold-coin-o"/>
            <div class="stat-content">
              <div class="stat-label">销售额</div>
              <div class="stat-value">¥{{ formatMoney(yesterday.totalSales) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="chart-trending-o"/>
            <div class="stat-content">
              <div class="stat-label">总利润</div>
              <div class="stat-value">¥{{ formatMoney(yesterday.totalProfit) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 当月数据 -->
      <div v-if="thisMonth" class="stats-card">
        <div class="card-header">
          <h3 class="card-title">当月数据</h3>
          <span class="date-tag">{{ getCurrentMonth() }}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <van-icon class="stat-icon" name="orders-o"/>
            <div class="stat-content">
              <div class="stat-label">订单数</div>
              <div class="stat-value">{{ formatNumber(thisMonth.orderCount) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="gold-coin-o"/>
            <div class="stat-content">
              <div class="stat-label">销售额</div>
              <div class="stat-value">¥{{ formatMoney(thisMonth.totalSales) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <van-icon class="stat-icon" name="chart-trending-o"/>
            <div class="stat-content">
              <div class="stat-label">总利润</div>
              <div class="stat-value">¥{{ formatMoney(thisMonth.totalProfit) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";

export default {
  name: "MyMine",
  data() {
    return {
      today: null,
      yesterday: null,
      thisMonth: null,
    }
  },
  methods: {
    async getToday() {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const firstDayOfMonthStr = firstDayOfMonth.toISOString().split('T')[0];

      try {
        const [todayData, yesterdayData, monthData] = await Promise.all([
          api.statistics.getDateRangeStatistics({startDate: todayStr, endDate: todayStr}),
          api.statistics.getDateRangeStatistics({startDate: yesterdayStr, endDate: yesterdayStr}),
          api.statistics.getDateRangeStatistics({startDate: firstDayOfMonthStr, endDate: todayStr})
        ]);

        this.today = todayData;
        this.yesterday = yesterdayData;
        this.thisMonth = monthData;
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    },

    formatNumber(num) {
      return new Intl.NumberFormat().format(num);
    },

    formatMoney(amount) {
      return new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }).format(date);
    },

    getYesterday() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    },

    getCurrentMonth() {
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long'
      }).format(new Date());
    }
  },
  mounted() {
    this.getToday();
  }
}
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 0;
  background-color: #ffffff;
  border-bottom: 1px solid #ebedf0;
}

.title {
  font-size: 28px;
  color: #303133;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

.version {
  font-size: 14px;
  color: #909399;
  margin: 8px 0 0;
}
.statistics-dashboard {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.stats-groups {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: var(--van-tabbar-height);
}

.stats-card {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #ebedf0;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #1989fa;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #f0f2f5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.date-tag {
  font-size: 13px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-icon {
  font-size: 24px;
  color: #409eff;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

@media (max-width: 480px) {
  .statistics-dashboard {
    padding: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-item {
    padding: 10px;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>
