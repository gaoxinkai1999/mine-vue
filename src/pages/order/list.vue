<template>
  <div class="order-list-page">
    <van-nav-bar
        title="全部订单"
        right-text="筛选"
        @click-right="goToChooseOrder()"
        fixed
        placeholder
        safe-area-inset-top
    />
    <div class="tabs-container">
      <van-tabs v-model="active" sticky>
        <van-tab title="销售订单">
          <div class="tab-content-container">
            <SalesOrderList></SalesOrderList>
          </div>
        </van-tab>
        <van-tab title="退货订单">
          <div class="tab-content-container">
            内容 2
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import SalesOrderList from "@/components/Order/SalesOrderList.vue";

export default {
  name: "AllOrder",
  components: {SalesOrderList},
  data() {
    return {
      active:0 //默认显示销售订单
    }
  },
  created() {
  },
  methods: {
    goToChooseOrder() {
      this.$router.push({
        path: '/order/OrderPage',
      })
    }
  },
}
</script>


<style scoped>
.order-list-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: var(--van-tabbar-height);
  display: flex;
  flex-direction: column;
}

.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tab-content-container {
  flex: 1;
  overflow-y: auto;
  height: calc(100vh - 46px - 44px - var(--van-tabbar-height));
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px;
}

:deep(.van-tabs) {
  width: 100%;
  z-index: 10;
}

:deep(.van-tabs__wrap) {
  position: sticky;
  top: 46px;
  z-index: 10;
  background-color: #fff;
}

:deep(.van-tabs__content) {
  flex: 1;
  overflow: visible;
}

:deep(.van-tab__pane) {
  height: 100%;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .order-list-page {
    padding-bottom: calc(var(--van-tabbar-height) + env(safe-area-inset-bottom, 0px));
  }
  
  .tab-content-container {
    height: calc(100vh - 46px - 44px - var(--van-tabbar-height) - env(safe-area-inset-bottom, 0px));
  }
}
</style>