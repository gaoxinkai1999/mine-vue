<template>
  <div class="sidebar">
    <van-sidebar v-model="activeIndex">
      <van-sidebar-item
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
      />
    </van-sidebar>
  </div>
</template>

<script>
export default {
  name: 'CategorySidebar',
  props: {
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    modelValue: {
      type: Number,
      default: 0
    }
  },
  computed: {
    activeIndex: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 25vw; /* 改用视窗单位 */
  max-width: 100px; /* 最大宽度限制 */
  min-width: 80px; /* 最小宽度保证 */
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0; /* 禁止侧边栏收缩 */
}

.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

@media (max-width: 320px) {
  .sidebar {
    width: 70px;
  }
}
</style>