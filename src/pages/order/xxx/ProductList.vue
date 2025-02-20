<template>

  <div class="product-list">
    <van-card
        v-for="(item, index) in products"
        :key="index"
        :price="`${item.price}`"
        :title="item.name"
    >
      <template #tags>
        <van-tag v-if="item.inventory < 10" plain type="danger">剩{{ item.inventory }}件</van-tag>
        <van-tag v-else plain type="success">库存充足剩{{ item.inventory }}件</van-tag>
      </template>

      <template #footer>
        <van-stepper
            v-model="item.count"
            :max="item.inventory"
            button-size="22"
            min="0"
            theme="round"
            @change="() => handleChange(item)"
        />
      </template>
    </van-card>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    handleChange(item) {
      this.$emit('update-cart', item)
    }
  }
}
</script>
<style scoped>
.product-list {
  flex: 1;
  width: 0; /* 关键：防止溢出 */
  min-width: 0; /* 允许内容收缩 */
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 卡片样式优化 */
.product-list :deep(.van-card) {
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  min-height: 100px; /* 确保卡片有最小高度 */
}

/* 内容区域布局优化 */
.product-list :deep(.van-card__content) {
  padding-right: 70px; /* 为步进器留出空间 */
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 标题样式优化 */
.product-list :deep(.van-card__title) {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多显示两行 */
  -webkit-box-orient: vertical;
  word-break: break-word;
}

/* 标签容器样式 */
.product-list :deep(.van-card__tags) {
  width: 100%;
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 20px; /* 确保有足够空间显示标签 */
}

/* 标签样式 */
.product-list :deep(.van-tag) {
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 价格样式 */
.product-list :deep(.van-card__price) {
  color: #ff4444;
  font-size: 16px;
  font-weight: bold;
  margin-top: 4px;
}

/* 步进器位置优化 */
.product-list :deep(.van-card__footer) {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 110px;
  z-index: 1; /* 确保步进器在最上层 */
}

/* 步进器样式优化 */
.product-list :deep(.van-stepper) {
  width: 110px;
  transform: scale(0.9); /* 稍微缩小步进器 */
  transform-origin: right bottom;
}

/* 滚动条样式 */
.product-list::-webkit-scrollbar {
  width: 4px;
}

.product-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.product-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>

