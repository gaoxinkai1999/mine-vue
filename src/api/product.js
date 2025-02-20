import request from '@/utils/axiosConfig'

const api = {
  /**
   * @description 更新商品信息
   * @url /product/update
   * @method POST
   * @param {Object} data Request body
   * @returns {Promise<any>}
   */
  batchUpdate(data) {
    return request({
      url: '/product/batchUpdate',
      method: 'POST',
      data
    })
  },

  /**
   * @description 查询所有商品
   * @url /product/getProducts
   * @method POST

   * @returns {Promise<any>}
   */
  getProducts() {
    return request({
      url: '/product/getProducts',
      method: 'POST'
    })
  },

  /**
   * @description 根据价格规则ID查询商品
   * @url /product/findByPriceRule/{priceRuleId}
   * @method GET
   * @param {number} priceRuleId 
   * @returns {Promise<any>}
   */
  findByPriceRule(priceRuleId) {
    return request({
      url: `/product/findByPriceRule/${priceRuleId}`,
      method: 'GET'
    })
  }
}

export default api