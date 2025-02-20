<template>
  <div class="main-container">
    <!-- 页面内容 -->
    <div class="page-content">
      <MyMine v-if="activeIndex==0"/>
      <NewOrder v-if="activeIndex==1"/>
      <OrderList v-if="activeIndex==2"/>
      <MyTools v-if="activeIndex==3"/>
    </div>

    <!-- 底部导航 -->
    <van-tabbar v-model="activeIndex" class="custom-tabbar">
      <van-tabbar-item icon="home-o" >主页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" >新建订单</van-tabbar-item>
      <van-tabbar-item icon="apps-o" >全部订单</van-tabbar-item>
      <van-tabbar-item icon="user-o" >我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>


import MyIndex from "@/pages/MyIndex.vue";
import MyMine from "@/pages/MyMine.vue";
import MyTools from "@/pages/MyTools.vue";
import {useMyStore} from '@/stores/defineStore.js'
import  NewOrder from  "@/pages/order/xxx/new.vue"
import  OrderList from  "@/pages/order/list.vue"
import {storeToRefs} from 'pinia'

export default {
  name: 'HelloWorld',
  components: {MyTools, MyMine, MyIndex, NewOrder, OrderList},
  setup() {
    const {activeIndex} = storeToRefs(useMyStore())
    return {
      activeIndex,
    }
  },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {},
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #f7f8fa;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--van-tabbar-height);
  box-sizing: border-box;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.custom-tabbar {
  --van-tabbar-item-active-color: #1989fa;
  --van-tabbar-item-font-size: 12px;
  --van-tabbar-item-icon-size: 22px;
  --van-tabbar-height: 50px;
  height: var(--van-tabbar-height);
  flex-shrink: 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  border-top: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
.custom-tabbar .van-tabbar-item {
  padding: 8px 0;
}

.custom-tabbar .van-tabbar-item__icon {
  margin-bottom: 4px;
  transition: transform 0.2s;
}

.custom-tabbar .van-tabbar-item--active .van-tabbar-item__icon {
  transform: scale(1.1);
}
</style>
