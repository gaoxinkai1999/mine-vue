<template>
  <div>
    <van-nav-bar
        title="添加商家"
    />
    <van-form @submit="onSubmit">
      <van-field
          v-model="shop.name"
          name="商家名"
          label="商家名"
          placeholder="商家名"
          :rules="[{ required: true, message: '商家名' }]"
      />
      <van-field
          v-model="shop.location"
          readonly
          name="位置"
          label="位置"
          placeholder="位置"
          :rules="[{ required: true, message: '位置' }]"
      />
      <van-field
          readonly
          clickable
          name="picker"
          :value="shop.priceRule.name"
          label="价格规则"
          @click="showPicker = true"
          :rules="[{ required: true, message: '价格规则' }]"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
            show-toolbar
            :columns="priceRules.map(item => item.name)"
            @confirm="onConfirm"
            @cancel="showPicker = false"
        />
      </van-popup>
      <span>默认为当前位置,点击修改</span>
      <div id="container"></div>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {Dialog, Toast} from "vant";

export default {
  name: "AddShop",
  data() {
    return {
      shop: {
        name: '',
        location: '',
        priceRule: {
          name: ''
        },
        longitude: '',
        latitude: ''
      },
      showPicker: false,
      priceRules: [],

      //map
      marker: null,
      map: null,
    }
  },
  mounted() {
    this.initMap()
    this.findAllPriceRules()
  },
  watch: {
    marker: {
      handler: function (newVal) {
        console.log(newVal.getPosition())
        //逆地理编码
        this.$reverseGeocode(newVal.getPosition(), (address) => {
          this.shop.location = address;
        });
        this.shop.longitude=newVal.getPosition().lng
        this.shop.latitude=newVal.getPosition().lat
      },

    }
  },
  methods: {
    initMap() {
      this.$getCurrentLocation().then(position => {

        // eslint-disable-next-line no-undef
        this.map = new AMap.Map("container", {
          viewMode: "3D",
          zoom: 17,
          center: position, // 初始坐标点，可以设置为默认值或第一家店铺位置
        });
        // eslint-disable-next-line no-undef
        this.marker = new AMap.Marker({
          position: position,
          map: this.map,
        });

        // 监听地图点击事件
        this.map.on('click', (e) => {
          console.log(e)
          const lnglat = e.lnglat; // 获取点击位置的经纬度坐标

          // 清除旧的标记点
          if (this.marker) {
            this.map.remove(this.marker);
          }

          // 添加新的标记点
          // eslint-disable-next-line no-undef
          this.marker = new AMap.Marker({
            position: lnglat,
            map: this.map,
          });
          // 可以在这里执行其他操作，例如逆地理编码获取地址信息等


        });
      })

    },
    onSubmit() {
      Dialog.confirm({
        title: '是否确认添加',
        message: '',
      })
          .then(() => {
            // on confirm
            this.$http.post('/shop/add', this.shop).then(res => {
              console.log(res)
              Toast.success('提交成功');
            })


          })
          .catch(() => {
            // on cancel
          });
    },
    onConfirm(value, index) {
      this.showPicker = false;
      this.shop.priceRule = this.priceRules[index];
    },
    findAllPriceRules() {
      this.$http.post('/priceRule/findByIsDel').then(res => {
        this.priceRules = res.data
      })
    }
  }
}
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  height: 40vh;
  text-align: center;
  background-color: rgba(58, 83, 98, 0.34);
}

#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 40vh;
}
</style>
