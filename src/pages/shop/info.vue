<template>
  <div>
    <van-nav-bar
        left-text="新建订单"
        right-text="编辑商家"
        title="商家信息"
        @click-left="goToNewOrder()"
        @click-right="goToSet()"
    />

    <van-cell-group v-if="shop!==''" inset title="基本信息">

      <van-cell :value="shop.location" size="large" title="地区"/>


      <van-cell :value="shop.name" size="large" title="商家名"/>


      <van-cell :value="shop.priceRule.name" size="large" title="价格规则"/>


      <van-field v-model="shop.arrears" input-align="right" label="欠款" size="large" type="digit"
                 @change="setArrears()"/>


    </van-cell-group>
    <van-cell-group inset title="位置信息">

      <div v-if="shop.longitude!==null" style=" margin-top:3vh">
        <van-button block color="#8BC96E" style=" margin-top:3vh" @click="handleNavigation()">开启导航</van-button>
      </div>
      <div style=" margin-top:3vh">
        <van-button block color="#AF5F4E" style=" margin-top:3vh" @click="setLocation">修改坐标为当前位置</van-button>
      </div>
    </van-cell-group>
    <van-cell-group inset title="订单">
      <div style=" margin-top:3vh">
        <van-button block style=" margin-top:3vh" type="success" @click="goToOrder">跳转到该商家订单</van-button>
      </div>
    </van-cell-group>


  </div>
</template>

<script>
import {Dialog, Toast} from "vant";
import api from "@/api";

export default {
  name: "ShopInfo",
  props: {
    id: Number,

  },
  data() {
    return {
      shop: '',
      orders: [],

    }
  },
  async mounted() {
    await this.findById()
  },
  methods: {
    //跳转路由到新建订单
    goToNewOrder() {
      this.$router.push({
        path: '/NewOrder',
        query: {
          ShopId: this.shop.id,
          ShopName: this.shop.name,
        }
      })
    },
    goToSet() {
      this.$router.push({
        path: '/shop/set',
        query: {
          id: this.shop.id,
        }
      })
    },
    // 跳转到该商家订单
    goToOrder() {
      this.$router.push({
        path: '/AllOrder',
        query: {
          shopId: this.shop.id,
        }
      })
    },

    async findById() {
      this.shop = await api.shop.getShop({id: this.$route.query.id})

    },

    handleNavigation() {
      if (this.shop.longitude !== null) {
        this.$gaode(this.shop.longitude, this.shop.latitude, this.shop.name)
        console.log()
      }
    },
    setArrears() {
      Dialog.confirm({
        title: '是否确认修改欠款为' + this.shop.arrears,
      })
          .then(() => {
            // on confirm
            this.$http.post('/shop/updateArrearsById', this.shop).then(() => {
              Toast.success('修改成功');
            })


          })
          .catch(() => {
            // on cancel
          });

    },
    setLocation() {
      Dialog.confirm({
        title: '确定当前位置准确?'
      })
          .then(() => {
            // on confirm
            this.$getCurrentLocation().then(position => {
              this.$http.post('/shop/updateLocationById',
                  this.$qs.stringify({id: this.shop.id, longitude: position.lng, latitude: position.lat})).then(() => {
                Toast.success('修改成功');
              })
            })


          })
          .catch(() => {
            // on cancel
          });


    }


  }
}

</script>

<style scoped>

</style>
