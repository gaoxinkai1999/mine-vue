<template>
  <van-popup
      v-model:show="showCart"
      position="bottom"
      class="cart-popup"
      overlay-class="cart-overlay"
  >
    <div class="cart-header">
      <span class="cart-title">购物车</span>
      <van-button
          size="small"
          type="danger"
          plain
          @click="clearCart"
      >
        清空
      </van-button>
    </div>

    <div class="cart-content">
      <van-cell
          v-for="item in cart"
          :key="item.id"
          :title="item.name"
          :label="`¥${item.price}`"
      >
        <template #right-icon>
          <van-stepper
              v-model="item.count"
              button-size="22"
              theme="round"
              min="0"
              @change="() => updateCart(item)"
          />
        </template>
      </van-cell>
    </div>
  </van-popup>
</template>

<script>
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'

export default {
  name: 'CartPopup',
  setup() {
    const store = useOrderStore()
    const { cart, showCart } = storeToRefs(store)
    const { updateCart, clearCart } = store

    return {
      cart,
      showCart,
      updateCart,
      clearCart
    }
  }
}
</script>

<style scoped>
.cart-popup {
  position: fixed !important;
  bottom: calc(var(--van-tabbar-height) + 60px) !important;
  left: 0;
  right: 0;
  border-radius: 16px 16px 0 0;
  max-width: 100vw; /* 限制最大宽度 */
  width: 100%;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.cart-title {
  font-size: 16px;
  font-weight: 500;
}

.cart-content {
  max-height: 50vh; /* 稍微降低最大高度 */
  overflow-y: auto;
  overflow-x: hidden;
}

/* 优化购物车项目布局 */
:deep(.van-cell) {
  padding: 12px 16px;
}

:deep(.van-stepper) {
  transform: scale(0.9); /* 稍微缩小步进器 */
  transform-origin: right center;
}

:deep(.cart-overlay) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: calc(var(--van-tabbar-height) + 60px) !important;
  background-color: rgba(0, 0, 0, 0.7) !important;
}
</style>