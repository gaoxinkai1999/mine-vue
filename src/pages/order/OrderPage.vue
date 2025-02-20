<template>
  <div>
    <van-nav-bar
        title="筛选订单"
    />
    <van-form @submit="onSubmit">
      <van-field
          clickable
          label="商家"
          placeholder="选择商家"
          readonly
          @click="showPicker = true"
      >
        <template v-if="shop.id!==undefined" #input>
        <span> ({{ shop.location }}){{ shop.name }}

           <van-tag v-if="shop.isDel" type="danger">弃用</van-tag>
        </span>
        </template>
      </van-field>

      <!-- 全屏商家选择弹窗 -->
      <van-popup
          v-model:show="showPicker"
          position="bottom"

      >
        <van-nav-bar
            right-text="关闭"
            title="选择商家"
            @click-right="showPicker=false"
        ></van-nav-bar>
          <ShopListItem @selectShop="receiveDataFromChild"></ShopListItem>

      </van-popup>


      <van-field
          :value="form.localDate"
          clickable
          label="日历"
          name="calendar"
          placeholder="点击选择日期"
          readonly
          @click="showCalendar = true"
      />
      <van-calendar v-model="showCalendar" @confirm="onConfirmDate"/>
      <div style="margin: 16px;">
        <van-button block native-type="submit" round type="info">确认筛选条件</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import ShopListItem from "@/components/Shop/ShopListItem.vue";

export default {
  name: "ChooseOrder",
  components: {ShopListItem},
  data() {
    return {
      showCalendar: false,
      showPicker: false,
      shops: [],
      shop: {},
      form: {
        shopId: null,
        localDate: null,
      }
    }
  },
  created() {
    // this.getShops();
  },
  methods: {
    onSubmit() {
      // 保存数据到 localStorage
      this.$router.push({
        path: '/AllOrder',
        query: {
          shopId: this.form.shopId,
          localDate: this.form.localDate,
        }
      })
      localStorage.setItem('shopId', this.$qs.stringify(this.form.shopId));
      localStorage.setItem('shopName', this.$qs.stringify('(' + this.shop.location + ')' + this.shop.name));
      localStorage.setItem('localDate', this.$qs.stringify(this.form.localDate));

    },
    onConfirmShop(value, index) {
      this.shop = this.shops[index[0]].children[index[1]].value
      this.form.shopId = this.shop.id
      this.showPicker = false
    },

    onConfirmDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份补零
      const day = String(date.getDate()).padStart(2, '0'); // 日补零
      this.form.localDate = `${year}-${month}-${day}`;

      this.showCalendar = false;

    },
    // getShops() {
    //   //请求商家级联数据
    //   this.$http.post('/shop/findAll').then(res => {
    //     // 转换后的数组
    //     this.shops = Object.keys(res.data).map(key => {
    //       return {
    //         text: key,
    //         value: key,
    //         children: res.data[key].map(item => {
    //           return {
    //             text: "(" + item.location + ")" + item.name + (item.isDel ? '(弃用)' : ''),
    //             value: item
    //           };
    //         })
    //       };
    //     });
    //   })
    //
    // },

    receiveDataFromChild(data) {
      this.shop = data
      this.showPicker = false
      // 处理从子组件传来的数据
      console.log(data)
    }
  }
}
</script>


<style scoped>

</style>