<template>
  <div class="app">
    <!-- 品类列表 -->
    <div class="category-list">
      <draggable
          v-model="categories"
          item-key="id"
          :animation="300"
          @end="onCategoryDragEnd"
      >
        <template #item="{ element }">
          <van-button
              :type="activeCategory === element.id ? 'primary' : 'default'"
              size="small"
              @click="setActiveCategory(element.id)"
          >
            {{ element.name }}
          </van-button>
        </template>
      </draggable>
      <van-button icon="plus" size="small" @click="showCategoryPopup = true">
        管理品类
      </van-button>
    </div>

    <!-- 商品列表 -->
    <div class="goods-list">
      <div v-if="currentFoods.length === 0" class="empty">
        暂无商品
      </div>
      <draggable
          v-else
          v-model="currentFoods"
          item-key="id"
          :animation="300"
          :delay="0"
          :touchStartThreshold="2"
          :handle="'.drag-handle'"
          @end="onDragEnd"
      >
        <template #item="{ element }">
          <div class="goods-item">
            <div class="drag-handle">
              <van-icon name="bars"/>
            </div>
            <div class="goods-info">
              <h4>{{ element.name }}</h4>
              <p>品类：{{ element.category?.name || '未分类' }}</p>
              <p>库存：{{ element.inventory }}</p>
              <p>成本价：￥{{ element.costPrice }}</p>
              <p>默认售价：￥{{ element.defaultSalePrice }}</p>
            </div>
            <div class="goods-actions">
              <van-button size="normal" type="primary" @click="editItem(element)">编辑</van-button>
              <van-button size="normal" type="danger" @click="deleteItem(element.id)">删除</van-button>
            </div>
          </div>
        </template>
      </draggable>

      <van-button
          block
          style="margin-top: 16px"
          type="primary"
          @click="showAddPopup = true"
      >
        新增商品
      </van-button>
    </div>

    <!-- 品类管理弹出层 -->
    <van-popup v-model:show="showCategoryPopup" :style="{ height: '50%' }" position="bottom">
      <div class="popup-content">
        <van-field
            v-model="newCategoryName"
            label="品类名称"
            placeholder="请输入品类名称"
            required
        />
        <div class="popup-actions">
          <van-button block type="primary" @click="addCategory">新增品类</van-button>
          <van-button block type="default" @click="showCategoryPopup = false">关闭</van-button>
        </div>
        <div v-for="category in categories" :key="category.id" class="category-item">
          <span>{{ category.name }}</span>
          <van-button
              v-if="category.name !== '全部'"
              plain
              size="small"
              type="danger"
              @click="deleteCategory(category.id)"
          >
            删除
          </van-button>
        </div>
      </div>
    </van-popup>

    <!-- 新增/编辑商品弹出层 -->
    <van-popup v-model:show="showAddPopup" :style="{ height: 'auto', padding: '16px' }" position="bottom">
      <div class="popup-content">
        <van-field
            v-model="newItem.name"
            label="商品名称"
            placeholder="请输入商品名称"
            required
        />
        <van-field
            v-model="newItem.defaultSalePrice"
            label="默认售价"
            placeholder="请输入售价"
            required
            type="number"
        />
        <van-field
            v-model="newItem.inventory"
            label="库存"
            placeholder="请输入库存"
            required
            type="number"
        />
        <van-field
            v-model="newItem.category.name"
            clickable
            label="品类"
            placeholder="请选择品类"
            readonly
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
              :columns="categoryOptions"
              show-toolbar
              @cancel="showPicker = false"
              @confirm="onPickerConfirm"
          />
        </van-popup>
        <div class="popup-actions">
          <van-button block type="primary" @click="saveNewItem">保存</van-button>
          <van-button block type="default" @click="cancelEdit">取消</van-button>
        </div>
      </div>
    </van-popup>


  </div>
</template>

<script>

import draggable from 'vuedraggable'
import api from "@/api";
import {showFailToast, showSuccessToast} from "vant";


export default {
  components: {
    draggable,

  },

  data() {
    return {
      goodsList: [],
      categories: [],
      activeCategory: 0,
      showCategoryPopup: false,
      newCategoryName: "",
      showAddPopup: false,
      showPicker: false,
      newItem: this.getEmptyNewItem(),
      isEdit: false,
      loading: true
    };
  },
  computed: {
    currentFoods: {
      get() {
        return this.goodsList.filter(food =>
            food.category?.id === this.activeCategory
        );
      },
      set(value) {
        const otherFoods = this.goodsList.filter(food =>
           food.category?.id !== this.activeCategory
        );
        this.goodsList = [...otherFoods, ...value];
      }
    },
    categoryOptions() {
      return this.categories.map(c => ({ text: c.name, value: c.id }));
    }
  },
  methods: {
    async getCategories() {
      try {
        this.categories = await api.category.getCategories();
        this.activeCategory=this.categories[0].id
      } catch (error) {
        console.error('获取品类失败:', error);
      }
    },
    async getProducts() {
      try {
        this.goodsList = await api.product.getProducts();
      } catch (error) {
        console.error('获取商品失败:', error);
      } finally {
        this.loading = false;
      }
    },
    getEmptyNewItem() {
      return {
        id: null,
        name: "",
        defaultSalePrice: 0,
        inventory: 0,
        category: { id: null, name: "" }
      };
    },
    onPickerConfirm({ selectedOptions }) {
      const selected = this.categories.find(c => c.id === selectedOptions[0].value);
      this.newItem.category = { ...selected };
      this.showPicker = false;
    },
    setActiveCategory(id) {
      this.activeCategory = id;
    },
    async addCategory() {
      if (!this.newCategoryName.trim()) {
        showFailToast("品类名称不能为空");
        return;
      }

      try {
        const newCategory = await api.category.create({
          name: this.newCategoryName,
          sort: this.categories.length
        });
        this.categories.push(newCategory);
        this.newCategoryName = "";
        showSuccessToast("品类已新增");
      } catch (error) {
        console.error('新增品类失败:', error);
      }
    },
    async deleteCategory(id) {
      try {
        const hasGoods = this.goodsList.some(item => item.category?.id === id);
        if (hasGoods) {
          showFailToast("该品类下存在商品，无法删除");
          return;
        }

        await api.category.delete(id);
        this.categories = this.categories.filter(c => c.id !== id);
        showSuccessToast("品类已删除");
      } catch (error) {
        console.error('删除品类失败:', error);
      }
    },
    async deleteItem(id) {
      try {
        await api.product.delete(id);
        this.goodsList = this.goodsList.filter(item => item.id !== id);
        showSuccessToast("商品已删除");
      } catch (error) {
        console.error('删除商品失败:', error);
      }
    },
    editItem(item) {
      this.newItem = {
        ...item,
        category: { ...item.category }
      };
      this.isEdit = true;
      this.showAddPopup = true;
    },
    cancelEdit() {
      this.showAddPopup = false;
      this.newItem = this.getEmptyNewItem();
      this.isEdit = false;
    },
    async saveNewItem() {
      if (!this.validateItem()) return;

      try {
        if (this.isEdit) {
          await api.product.batchUpdate([this.newItem]);
          const index = this.goodsList.findIndex(i => i.id === this.newItem.id);
          this.goodsList.splice(index, 1, this.newItem);
        } else {
          const newProduct = await api.product.create(this.newItem);
          this.goodsList.push(newProduct);
        }

        this.cancelEdit();
        showSuccessToast("操作成功");
      } catch (error) {
        console.error('保存失败:', error);
      }
    },
    validateItem() {
      if (!this.newItem.name ||
          !this.newItem.category?.id ||
          this.newItem.defaultSalePrice <= 0 ||
          this.newItem.inventory < 0) {
        showFailToast("请填写完整信息");
        return false;
      }
      return true;
    },
    async onDragEnd() {
      try {
        await api.product.batchUpdate(
            this.currentFoods.map((item, index) => ({
              id: item.id,
              sort: index
            }))
        );
        showSuccessToast('排序已更新');
      } catch (error) {
        console.error('排序失败:', error);
      }
    },
    async onCategoryDragEnd() {
      try {
        await api.category.update(
            this.categories.map((item, index) => ({
              id: item.id,
              sort: index
            }))
        );
        showSuccessToast('排序已更新');
      } catch (error) {
        console.error('排序失败:', error);
      }
    }
  },
  async mounted() {
    await this.getCategories();
    await this.getProducts();
  }
};
</script>

<style scoped>
.app {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  background: #f7f8fa;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 品类列表样式 */
.category-list {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* 直接给按钮添加右边距 */
.category-list :deep(.van-button) {
  margin-right: 12px; /* 添加按钮之间的间距 */
}

.category-list::-webkit-scrollbar {
  display: none;
}

/* 商品列表样式 */
.goods-list {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-top: 60px; /* 为固定定位的category-list留出空间 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
}

.goods-item {
  position: relative;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  border: 1px solid #ebedf0;
  user-select: none;
}

.goods-item:last-child {
  margin-bottom: 0;
}

.goods-item:active {
  background: #f7f8fa;
}

.drag-handle {
  padding: 8px;
  cursor: move;
  color: #999;
  display: flex;
  align-items: center;
  touch-action: none;
  transition: color 0.3s ease;
}

.drag-handle:active {
  color: #666;
}

.goods-info {
  flex: 1;
  margin: 0 16px;
  min-width: 0; /* 防止文本溢出 */
}

.goods-info h4 {
  margin: 0;
  font-size: 16px;
  color: #323233;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #969799;
  line-height: 1.4;
}

.goods-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 弹出层样式 */
.popup-content {
  padding: 20px 16px;
}

.popup-actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 品类管理样式 */
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebedf0;
}

.category-item:last-child {
  border-bottom: none;
}

.empty {
  text-align: center;
  color: #969799;
  padding: 32px 0;
  font-size: 14px;
}

/* 拖拽效果 */
.sortable-ghost {
  opacity: 0.5;
  background: #f2f3f5;
  border: 1px dashed #dcdee0;
}

.sortable-drag {
  opacity: 0.9;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

/* 表单字段样式优化 */
:deep(.van-field) {
  margin-bottom: 12px;
}

:deep(.van-button) {
  height: 40px;
  line-height: 38px;
}

:deep(.van-button--small) {
  height: 32px;
  line-height: 30px;
  padding: 0 12px;
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .app {
    background: #1c1c1e;
  }

  .goods-item,
  .category-list,
  .goods-list {
    background: #2c2c2e;
    border-color: #3a3a3c;
  }

  .goods-info h4 {
    color: #fff;
  }

  .goods-info p {
    color: #8e8e93;
  }

  .category-item {
    border-color: #3a3a3c;
  }

  .empty {
    color: #8e8e93;
  }

  .sortable-ghost {
    background: #3a3a3c;
    border-color: #4a4a4c;
  }

  .sortable-drag {
    background: #2c2c2e;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .goods-item:active {
    background: #3a3a3c;
  }
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .app {
    padding: 12px;
  }

  .goods-actions {
    flex-direction: column;
  }

  .goods-info {
    margin: 0 12px;
  }
}

</style>