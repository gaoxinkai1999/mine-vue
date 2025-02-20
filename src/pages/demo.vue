<template>
  <div class="container">
    <!-- 顶部导航 -->
    <van-nav-bar
        title="蜜雪冰城"
        left-text="上海人民广场店"
        left-arrow
        fixed
    />

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧分类导航 -->
      <van-sidebar v-model="activeCategory" class="category-nav">
        <van-sidebar-item
            v-for="category in categories"
            :key="category.id"
            :title="category.name"
        />
      </van-sidebar>

      <!-- 右侧商品列表 -->
      <div class="product-list">
        <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
        >
          <img :src="product.image" class="product-image" />
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-desc">{{ product.description }}</p>
            <div class="price-area">
              <span class="price">￥{{ product.price }}</span>
              <van-stepper
                  v-model="product.quantity"
                  theme="round"
                  button-size="22"
                  disable-input
                  @plus="addToCart(product)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车 -->
    <van-submit-bar
        :price="totalPrice"
        button-text="去结算"
        button-color="#ff4444"
        @submit="showCart=true"
        class="aaa"
    >
      <span class="cart-info">已选 {{ totalCount }} 件</span>
    </van-submit-bar>

    <!-- 购物车弹窗 -->
    <van-popup v-model:show="showCart" position="bottom"  teleport="aaa" round>
      <van-cell :title="item.name" v-for="item in cartItems"></van-cell>

    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';


// 模拟数据
// 分类数据
const showCart = ref(false);
const categories = ref([
  { id: 0, name: "经典饮品" },
  { id: 1, name: "冰淇淋" },
  { id: 2, name: "芝士奶盖" },
  { id: 3, name: "咖啡系列" },
  { id: 4, name: "小食甜品" },
  { id: 5, name: "超值套餐" }
]);

// 商品数据
const products = ref([
  {
    id: 1,
    name: "冰鲜柠檬水",
    description: "四季鲜柠，清爽首选",
    price: 6.0,
    image: "https://via.placeholder.com/100x100.png?text=Lemon",
    category: 0
  },
  {
    id: 2,
    name: "草莓奶昔",
    description: "新鲜草莓制作，甜蜜暴击",
    price: 10.0,
    image: "https://via.placeholder.com/100x100.png?text=Strawberry",
    category: 0
  },
  {
    id: 3,
    name: "芒果冰沙",
    description: "热带风情，冰爽一夏",
    price: 12.0,
    image: "https://via.placeholder.com/100x100.png?text=Mango",
    category: 0
  },
  {
    id: 4,
    name: "抹茶冰淇淋",
    description: "日式抹茶，丝滑口感",
    price: 8.0,
    image: "https://via.placeholder.com/100x100.png?text=Matcha",
    category: 1
  },
  {
    id: 5,
    name: "巧克力圣代",
    description: "浓郁可可，甜蜜享受",
    price: 9.0,
    image: "https://via.placeholder.com/100x100.png?text=Chocolate",
    category: 1
  },
  {
    id: 6,
    name: "芝士绿妍",
    description: "茶香四溢，奶盖绵密",
    price: 14.0,
    image: "https://via.placeholder.com/100x100.png?text=CheeseTea",
    category: 2
  },
  {
    id: 7,
    name: "美式咖啡",
    description: "现磨咖啡豆，香醇浓郁",
    price: 10.0,
    image: "https://via.placeholder.com/100x100.png?text=Coffee",
    category: 3
  },
  {
    id: 8,
    name: "薯条套餐",
    description: "香脆薯条+柠檬水",
    price: 15.0,
    image: "https://via.placeholder.com/100x100.png?text=Combo",
    category: 5
  }
]);

const activeCategory = ref(0);
const cartItems = ref([]);

// 计算属性
const filteredProducts = computed(() => {
  return products.value.filter(p => p.category === activeCategory.value);
});

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100;
});

const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// 方法
const addToCart = (product) => {
  const existItem = cartItems.value.find(item => item.id === product.id);
  if (existItem) {
    existItem.quantity++;
  } else {
    cartItems.value.push({ ...product, quantity: 1 });
  }
};

const onSubmit = () => {
  // 提交订单逻辑
};
</script>

<style scoped>
.container {
  padding-top: 46px; /* 导航栏高度 */
  padding-bottom: 50px; /* 底部栏高度 */
}

.main-content {
  display: flex;
  height: calc(100vh - 96px);
}

.category-nav {
  width: 100px;
  background: #f5f5f5;
}

.product-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.product-card {
  display: flex;
  margin-bottom: 15px;
  background: white;
  border-radius: 8px;
  padding: 10px;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 6px;
}

.product-info {
  flex: 1;
  margin-left: 12px;
}

.price-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.price {
  color: #ff4444;
  font-size: 16px;
  font-weight: bold;
}

.cart-info {
  margin-left: 10px;
  color: #666;
}
</style>
