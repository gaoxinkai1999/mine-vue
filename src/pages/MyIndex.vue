<template>
  <div class="delivery-system">
    <!-- 顶部区域 -->
    <header class="header">
      <div class="header-content">
        <h1 class="title">门店配送系统</h1>
        <div class="version-info">
          <span class="version">v{{ version }}</span>
          <span class="changelog" v-if="changelog">{{ changelog }}</span>
        </div>
      </div>
    </header>

    <!-- 主功能区域 -->
    <main class="main-content">
      <div class="menu-grid">
        <router-link
            v-for="(item, index) in menuItems"
            :key="index"
            :to="item.to"
            class="menu-card"
        >
          <div class="menu-card-content">
            <van-icon :name="item.icon" class="menu-icon" />
            <span class="menu-text">{{ item.text }}</span>
          </div>
        </router-link>
      </div>
    </main>

    <!-- 底部备案信息 -->
    <footer class="footer">
      <a
          class="beian-link"
          href="https://beian.miit.gov.cn/"
          rel="noopener noreferrer"
          target="_blank"
      >
        晋ICP备2023014165号
      </a>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useMyStore } from '@/stores/defineStore.js'
export default {
  name: 'DeliverySystem',
  computed:{
    ...mapState(useMyStore,['version','changelog'])
  },
  data() {
    return {

      menuItems: [
        {
          icon: 'shopping-cart-o',
          text: '新建销售订单',
          to: '/order/new'
        },
        // {
        //   icon: 'replay',
        //   text: '新建其他订单',
        //   to: '/SaveReturnOrder'
        // },
        // {
        //   icon: 'shop-o',
        //   text: '添加商家',
        //   to: '/AddShop'
        // },
        // {
        //   icon: 'logistics',
        //   text: '库存采购',
        //   to: '/StockIn'
        // }
      ]
    }
  },
  created() {
    // this.version = localStorage.getItem('version')
    // this.changelog = localStorage.getItem('changelog')
  }
}
</script>

<style scoped>
.delivery-system {
  height: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%);
}

.header {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 8px 0;
}

.title {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 12px;
  position: relative;
  display: inline-block;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #1989fa;
  border-radius: 2px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.delivery-system {

  padding: 24px;
  flex-direction: column;
  background-color: #f7f8fa;
}

.header {
  margin-bottom: 32px;
}

.header-content {
  text-align: center;
}

.title {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.version-info {
  display: flex;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.main-content {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  padding: 8px;
}

.menu-card {
  text-decoration: none;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.menu-card:active {
  transform: scale(0.98);
}

.menu-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.menu-icon {
  font-size: 32px;
  color: #1989fa;
}

.menu-text {
  font-size: 16px;
  color: #323233;
  font-weight: 500;
}

.footer {
  margin-top: auto;
  padding: 24px 0 8px;
  text-align: center;
}

.beian-link {
  color: #969799;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.beian-link:hover {
  color: #666;
}

@media (max-width: 640px) {
  .delivery-system {
    padding: 16px;
  }

  .title {
    font-size: 24px;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .menu-card {
    padding: 20px;
  }

  .menu-icon {
    font-size: 28px;
  }
}
.delivery-system {
  min-height: calc(100vh - 60px);
  padding: 24px 16px;
  background: linear-gradient(180deg, #f7f8fa 0%, #ffffff 100%);
}

.title {
  font-size: 32px;
  color: #1a1a1a;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;
}

.title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #1989fa;
  border-radius: 2px;
}

.menu-grid {
  gap: 24px;
  padding: 16px 0;
}

.menu-card {
  border: 1px solid #ebedf0;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(25, 137, 250, 0.12);
}

.version-info {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
}
</style>

