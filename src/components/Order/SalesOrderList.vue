<template>
  <div class="sales-order-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group v-for="(item, index) in orders" :key="index" class="order-card">
        <!-- 订单头部 -->
        <van-cell class="order-header">
          <template #title>
            <div class="order-header-content">
              <div class="order-header-left">
                <span class="order-id">ID: {{ item.id }}</span>
                <span class="order-time">{{ item.createTime }}</span>
              </div>
              <van-button size="small" type="primary" @click="openActionSheet(item)">
                操作
              </van-button>
            </div>
          </template>
        </van-cell>

        <!-- 商家信息 -->
        <van-cell class="shop-info" icon="shop-o" size="large">
          <template #title>
            <div class="shop-title">
              <span class="shop-name">{{ item.shop.name }}</span>
              <van-tag v-if="item.shop.del" type="danger">弃用</van-tag>
            </div>
          </template>
          <template #label>
            <span class="shop-location">{{ item.shop.location }}</span>
          </template>
        </van-cell>

        <!-- 订单详情 -->
        <div class="order-details">
          <div v-for="(orderDetail, detailIndex) in item.orderDetails"
               :key="detailIndex"
               class="order-detail-item"
          >
            <div class="product-info">
              <span class="product-name">{{ orderDetail.product.name }}</span>
              <van-tag v-if="!orderDetail.defaultPrice" type="danger" size="mini">特价</van-tag>
            </div>
            <div class="quantity-price">
              <span class="quantity">x{{ orderDetail.quantity }}</span>
              <span class="price">¥{{ orderDetail.totalSalesAmount }}</span>
            </div>
          </div>
        </div>

        <!-- 订单汇总 -->
        <div class="order-summary">
          <div class="summary-item">
            <span class="label">总价</span>
            <span class="value">¥{{ item.totalSalesAmount }}</span>
          </div>
          <div class="summary-item">
            <span class="label">利润</span>
            <span class="value">¥{{ item.totalProfit }}</span>
          </div>
        </div>
      </van-cell-group>
    </van-list>

    <!-- 操作面板 -->
    <van-action-sheet
        v-model:show="showActionSheet"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @select="onSelect"
    />
  </div>
</template>

<script>

import { Clipboard } from '@capacitor/clipboard';

import api from "@/api";
import {formatReceipt, printOrder} from "@/utils/printService";
import {showFailToast} from "vant";

export default {
  name: 'SalesOrderList',
  data() {
    return {
      orders: [],
      loading: false,
      finished: false,
      pageIndex: 0,
      pageSize: 10,
      showActionSheet: false,
      selectedOrder: null,
      actions: [
        { name: '打印订单', color: '#07c160' },
        { name: '复制订单', color: '#1989fa' },
        { name: '删除订单', color: '#ee0a24' }
      ]
    }
  },
  methods: {
    openActionSheet(order) {
      this.selectedOrder = order;
      this.showActionSheet = true;
    },
    onSelect(action) {
      switch (action.name) {
        case '打印订单':
          this.handlePrintOrder();
          break;
        case '复制订单':
          this.handleCopyOrder(this.selectedOrder);
          break;
        case '删除订单':
          this.handleDeleteOrder(this.selectedOrder.id);
          break;
      }
    },
    async handlePrintOrder() {
      try {
        await printOrder(this.selectedOrder, (status) => {
          console.log(status); // 或者更新UI显示状态
        });
      } catch (error) {
        console.error('打印失败', error);
      }

    },
    async handleCopyOrder(order) {
      try {
        const receipt = formatReceipt(order, false);
        await Clipboard.write({
          string: receipt
        });
        showSuccessToast('订单小票已复制到剪切板');
      } catch (err) {
        console.error('复制失败:', err);
        showFailToast('复制失败，错误信息:'+err);
      }


    },
    handleDeleteOrder(id) {
      showConfirmDialog ({
        title: '确认删除',
      }).then(() => {
        api.order.cancelOrder({ orderId: id }).then(() => {
          this.orders = this.orders.filter(item => item.id !== id);
        });
      }).catch(() => {
        // 取消删除
      });
    },
    async onLoad() {
      this.loading = true;
      const data = await api.order.getOrders({
        shopId: this.$route.query.shopId,
        localDate: this.$route.query.localDate,
        page: this.pageIndex,
        size: this.pageSize
      });
      this.orders.push(...data);
      this.pageIndex += 1;
      this.loading = false;
      if (data.length < this.pageSize) {
        this.finished = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sales-order-list {
  padding: 10px;
  background-color: #f5f5f5;

  .order-card {
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .order-header {
      &-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;

        .order-header-left {
          .order-id {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .order-time {
            font-size: 12px;
            color: #888;
            margin-left: 10px;
          }
        }
      }
    }

    .shop-info {
      .shop-title {
        display: flex;
        align-items: center;
        gap: 8px;

        .shop-name {
          font-size: 15px;
          font-weight: 600;
        }
      }

      .shop-location {
        font-size: 13px;
        color: #666;
      }
    }

    .order-details {
      padding: 12px;
      background-color: #fafafa;

      .order-detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .product-name {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .quantity-price {
          display: flex;
          align-items: center;
          gap: 12px;

          .quantity {
            color: #666;
            font-size: 13px;
          }

          .price {
            font-weight: 600;
            color: #333;
          }
        }
      }
    }

    .order-summary {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background-color: #e0f7fa;

      .summary-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .label {
          font-size: 13px;
          color: #666;
          margin-bottom: 4px;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}
</style>
