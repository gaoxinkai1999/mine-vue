<template>
  <div class="cart-bar">
    <div class="cart-info">
      <div class="cart-icon" @click="showCart = !showCart">
        <van-icon name="shopping-cart-o" size="24" />
        <van-badge :content="totalCount" v-if="totalCount > 0" />
      </div>
      <div class="total-price">
        ¥{{ totalPrice.toFixed(2) }}
      </div>
    </div>
    <van-button
        type="danger"
        class="checkout-btn"
        :disabled="totalPrice === 0"
        @click="submitOrder"
    >
      去结算
    </van-button>
  </div>
</template>

<script>
import { useOrderStore } from '@/stores/order'
import { storeToRefs } from 'pinia'

export default {
  name: 'CartBar',
  setup() {
    const store = useOrderStore()
    const { totalCount, totalPrice, showCart } = storeToRefs(store)
    const { submitOrder } = store

    return {
      totalCount,
      totalPrice,
      showCart,
      submitOrder
    }
  }
}
</script>

<style scoped>
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
  z-index: 2100;
}

.cart-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-icon {
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
</style>