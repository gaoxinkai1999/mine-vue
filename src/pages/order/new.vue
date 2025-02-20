<template>
  <div class="home">
    <van-sticky :offset-top="46">
      <div class="shop-info" @click="SwitchStore">
        <van-cell is-link>
          <template #title>
            <span>{{ nearbyShops[0].name }}</span>
          </template>
          <template #label>
            <van-icon name="location-o" />
            <span>{{ Math.round(nearbyShops[0].distance) }}米</span>
          </template>
          <template #value>
            <span>{{ nearbyShops[0].address }}</span>
          </template>
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </div>
    </van-sticky>
    <div class="shop-info--placeholder"></div>

    <div class="container">
      <van-sidebar v-model="activeCategory" class="sidebar">
        <van-sidebar-item
            v-for="(category, index) in categories"
            :key="index"
            :title="category.name"
        />
      </van-sidebar>

      <div class="food-list">
        <van-cell-group
            v-for="(item, index) in currentFoods"
            :key="index"
            inset
        >
          <van-cell :label="`¥${item.price}`" :title="item.name">
            <template #right-icon>
              <van-button
                  color="#ff4444"
                  round
                  size="small"
                  type="primary"
                  @click="addToCart(item)"
              >
                +
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>

    <div class="cart-bar">
      <div class="cart-info" @click="showCart = !showCart">
        <van-icon :badge="cart.length || ''" name="cart-o" size="24"/>
        <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
      </div>
      <van-button
          :disabled="!cart.length"
          class="checkout-btn"
          color="#ff4444"
          round
          @click="submit"
      >
        结算 ({{ cart.length }})
      </van-button>
    </div>

    <van-popup
        v-model:show="showCart"
        :style="{ maxHeight: '70vh' }"
        class="cart-popup"
        position="bottom"
        duration="0"
        :overlay="true"
    >
      <div class="cart-header">
        <h3>购物车 · {{ cart.length }}件</h3>
        <van-button
            v-if="cart.length"
            plain
            size="mini"
            type="danger"
            @click="clearCart"
        >
          清空
        </van-button>
      </div>

      <div class="cart-content">
        <van-empty v-if="cart.length === 0" description="购物车是空的"/>
        <div v-else class="cart-items">
          <div
              v-for="(item, index) in cart"
              :key="index"
              class="cart-item"
          >
            <div class="item-info">
              <div class="text-info">
                <div class="name">{{ item.name }}</div>
                <div class="price">¥{{ item.price * item.count }}</div>
              </div>
              <van-stepper
                  v-model="item.count"
                  button-size="22"
                  integer
                  min="0"
                  theme="round"
                  @change="updateCart"
              />
            </div>
          </div>
        </div>
      </div>

    </van-popup>
  </div>
</template>

<script>
import locationService from "@/utils/locationService";
import api from "@/api";
import {Dialog, showConfirmDialog, Toast} from "vant";

export default {
  data() {
    return {
      activeCategory: 0,
      showCart: false,
      cart: [],
      categories: [],
      foods: [],
      currentLocation: null,
      nearbyShops: [{name: "测试", distance: 0, address: ""}],
    };
  },
  mounted() {
    this.getNearbyShops()
    this.getProducts();
    this.getCategories();
  },
  computed: {
    currentFoods() {
      return this.foods.filter(food => food?.categoryId === this.categories[this.activeCategory].id);
    },
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.count, 0);
    },
  },
  methods: {
    async getProducts() {
      this.foods = await api.product.findByPriceRule(2);
    },
    async getCategories() {
      this.categories = await api.category.getCategories();
    },
    async getNearbyShops() {
      try {
        const {currentLocation, nearbyShops} = await locationService.getNearbyShops();
        this.currentLocation = currentLocation;
        this.nearbyShops = nearbyShops;
      } catch (error) {
        console.error('获取位置信息失败:', error);
      }
    },
    addToCart(item) {
      const existing = this.cart.find(cartItem => cartItem.id === item.id);
      if (existing) {
        existing.count++;
      } else {
        this.cart.push({...item, count: 1});
      }
    },
    updateCart() {
      this.cart = this.cart.filter(item => item.count > 0);
    },
    clearCart() {
      this.cart = [];
    },
    submit() {
      showConfirmDialog({
        title: '是否确认提交',
        message: '',
      })
          .then(() => {
            api.order.createOrder({shopId: this.nearbyShops.id, items: this.cart}).then(() => {
              Toast.success('提交成功');
            })
          });
    },
    SwitchStore() {
      console.log("SwitchStore")
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  background: #f8f8fa;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: env(safe-area-inset-bottom); /* 底部安全区域 */
  padding-top: env(safe-area-inset-top); /* 顶部安全区域 */
}

.shop-info {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.shop-info :deep(.van-cell) {
  padding: 0;
  background: transparent;
  line-height: 1.5;
}

.shop-info :deep(.van-cell__title) {
  margin: 0;
  display: flex;
  align-items: center;
}

.shop-info :deep(.van-cell__title-text) {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.shop-info :deep(.van-cell__label) {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #969799;
  font-size: 13px;
}

.shop-info :deep(.van-cell__value) {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  padding-right: 20px;
}

.shop-info :deep(.van-cell__right-icon) {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #c8c9cc;
  font-size: 16px;
}

.shop-info--placeholder {
  height: 70px;
}

.container {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: calc(var(--van-tabbar-height) + 60px);
  display: flex;
  background: #fff;
}

.sidebar {
  width: 85px;
  background: #f8f9fa;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
  flex-shrink: 0;
  height: 100%;
}

.food-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
  background: #fff;
  height: 100%;
}

.van-cell {
  padding: 12px 16px;
}

.van-cell__value {
  color: #ff4444;
  font-weight: 500;
}

.shop-info .van-cell__title {
  font-weight: 500;
}

.shop-info .van-cell__value {
  color: #666;
  font-size: 13px;
}

.cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--van-tabbar-height);
  height: 60px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 3000;
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-info .van-icon {
  position: relative;
  padding: 8px;
}

.total-price {
  font-size: 18px;
  color: #ff4444;
  font-weight: 600;
}

.checkout-btn {
  width: 140px;
  height: 40px;
  font-weight: 500;
}

.cart-popup {
  position: fixed !important;
  bottom: calc(var(--van-tabbar-height) + 60px) !important;
  left: 0;
  right: 0;
  border-radius: 16px 16px 0 0;
}

.cart-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: calc(var(--van-tabbar-height) + 60px) !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.cart-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.cart-content {
  padding: 16px;
  max-height: calc(70vh - 160px);
  overflow-y: auto;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cart-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-info {
  flex: 1;
}

.name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.price {
  font-size: 13px;
  color: #ff4444;
}

.sidebar::-webkit-scrollbar,
.food-list::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb,
.food-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-track,
.food-list::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.van-sidebar-item--select) {
  background: #fff;
  border-right-width: 0;
  &::before {
    width: 4px;
    background: #1989fa;
  }
}

.van-cell-group {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.sidebar,
.food-list {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

@media (max-width: 320px) {
  .sidebar {
    width: 70px;
  }
  
  .food-list {
    padding: 8px 4px;
  }
}

.home {
  overflow-x: hidden;
}

</style>

