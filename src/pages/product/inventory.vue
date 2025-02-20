<template>
  <div>
    <van-nav-bar
        title="库存管理"/>
    <el-table
        :data="products"
        border
        show-summary>
      <el-table-column align="center" label="商品名" prop="name"/>
      <el-table-column align="center" label="库存" prop="inventory"/>
      <!-- 修改此处以显示金额 -->
      <el-table-column align="center" label="金额" prop="totalPrice"/>
    </el-table>

  </div>
</template>

<script>

import api from "@/api/index.js";

export default {
  name: "InventoryData",
  data() {
    return {
      products: [],
    }
  },
  created() {
    this.getProducts()
  },
  methods: {
    async getProducts() {
      this.products = await api.product.getProducts();
      this.products.forEach(product => {
        product.totalPrice = (product.inventory * product.costPrice).toFixed(2);
      })

    },


  }
}
</script>


<style scoped>

</style>