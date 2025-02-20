<template>
  <div>
    <van-nav-bar
        title="价格规则"
        right-text="新建规则"
        @click-right="goToAddPriceRule"
    />
    <van-cell :title=item.name v-for="(item,index) in data" :key="index" is-link @click="goToInfo(item.id)"></van-cell>

  </div>

</template>

<script>
export default {
  name: "PriceRule",
  data() {
    return {
      data: []
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    findAll() {
      this.$http.post('/priceRule/findByIsDel',this.$qs.stringify({isDel:false})).then(res => {
        this.data = res.data
      })
    },

    goToInfo(id) {
      this.$router.push({
        path: '/PriceRuleInfo',
        query: {
          id: id
        }
      })
    },
    goToAddPriceRule() {
      this.$router.push({
        path: '/AddPriceRule'
      })
    }
  }

}
</script>


<style scoped>

</style>