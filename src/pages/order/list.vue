<template>
  <div>
    <van-nav-bar
        title="全部订单"
        right-text="筛选"
        @click-right="goToChooseOrder()"
        fixed
        placeholder
        safe-area-inset-top
    />
    <van-tabs v-model="active" sticky>
      <van-tab title="销售订单"><SalesOrderList></SalesOrderList></van-tab>
      <van-tab title="退货订单">内容 2</van-tab>
    </van-tabs>

  </div>

</template>

<script>



import SalesOrderList from "@/components/Order/SalesOrderList.vue";

export default {
  name: "AllOrder",
  components: {SalesOrderList},
  data() {
    return {
      active:0 //默认显示销售订单

    }
  },
  created() {
  },
  methods: {

    goToChooseOrder() {
      this.$router.push({
        path: '/order/OrderPage',
      })
    }


  },
}
</script>


<style scoped>




</style>