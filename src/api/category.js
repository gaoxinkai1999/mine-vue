import request from '@/utils/axiosConfig'

const api = {
  /**
   * @description 修改品类
   * @url /category/update
   * @method POST
   * @param {Object} data Request body
   * @returns {Promise<any>}
   */
  update(data) {
    return request({
      url: '/category/update',
      method: 'POST',
      data
    })
  },

  /**
   * @description 查询所有品类
   * @url /category/list
   * @method GET

   * @returns {Promise<any>}
   */
  getCategories() {
    return request({
      url: '/category/list',
      method: 'GET'
    })
  }
}

export default api