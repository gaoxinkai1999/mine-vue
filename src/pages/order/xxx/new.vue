<template>
  <div class="home">
    <ShopInfo
        :shop="nearbyShops[0]"
    />

    <div class="container">
      <CategorySidebar
          v-model="activeCategory"
          :categories="categories"
      />

      <ProductList
          :products="currentFoods"
          @update-cart="updateCart"
      />
    </div>

    <CartBar
        :cart="cart"
        :total-price="totalPrice"
        @show-cart="showCart = true"
        @submit="submitOrder"
    />

    <CartPopup
        v-model:show="showCart"
        :cart-items="cart"
        @update="updateCart"
        @clear="clearCart"
    />
  </div>
</template>

<script>
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'
import ShopInfo from './ShopInfo.vue'
import CategorySidebar from './CategorySidebar.vue'
import ProductList from './ProductList.vue'
import CartBar from './CartBar.vue'
import CartPopup from './CartPopup.vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'

export default {
  name: 'NewOrder',
  components: {
    ShopInfo,
    CategorySidebar,
    ProductList,
    CartBar,
    CartPopup
  },

  setup() {
    const store = useOrderStore()
    const { 
      activeCategory,
      categories,
      currentFoods,
      cart,
      nearbyShops,
      totalPrice,
      showCart
    } = storeToRefs(store)

    return {
      // 响应式状态
      activeCategory,
      categories,
      currentFoods,
      cart,
      nearbyShops,
      totalPrice,
      showCart,
      // 方法
      init: store.init,
      updateCart: store.updateCart,
      clearCart: store.clearCart,
      submitOrder: store.submitOrder
    }
  },

  mounted() {
    this.init()
  },

  beforeUnmount() {
    this.clearCart()
  }
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  background: #f8f8fa;
  min-height: 100%;
  width: 100%;
  max-width: 100vw; /* 限制最大宽度 */
  overflow-x: hidden; /* 防止水平溢出 */
}

.container {
  margin-top: 20px;
  margin-bottom: 60px;
  display: flex;
  background: #fff;
  flex: 1;
  width: 100%;
  height: calc(100vh - 120px - 60px - var(--van-tabbar-height));
  overflow: hidden; /* 防止内容溢出 */
}

/* 移动端适配 */
@media (max-width: 320px) {
  .container {
    margin-top: 115px;
  }
}

/* 触摸优化 */
.container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}
</style>