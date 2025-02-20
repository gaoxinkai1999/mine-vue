import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import api from '@/api'
import locationService from '@/utils/locationService'
import {showToast, showSuccessToast, showFailToast} from 'vant'

export const useOrderStore = defineStore('order', () => {
    // 状态
    const currentLocation = ref({})
    const activeCategory = ref(0)
    const categories = ref([])
    const foods = ref([])
    const cart = ref([])
    const nearbyShops = ref([{
        "id": 128,
        "name": "育青苑小卖部",
        "latitude": 37.602938,
        "longitude": 112.348135,
        "address": "育青苑小区",
        "distance": 43.45429229736328
    }, {
        "id": 243,
        "name": "晋乐山驴肉店",
        "latitude": 37.60148,
        "longitude": 112.350471,
        "address": "商业南街",
        "distance": 270.90704345703125
    }])
    const showCart = ref(false)
    const currentShop = ref({})
    // 计算属性
    const currentFoods = computed(() =>
        foods.value.filter(food =>
            food.categoryId === categories.value[activeCategory.value]?.id
        )
    )

    const totalPrice = computed(() =>
        cart.value.reduce((total, item) => total + item.price * item.count, 0)
    )

    const totalCount = computed(() =>
        cart.value.reduce((sum, item) => sum + item.count, 0)
    )

    // 方法
    async function init() {
        await getNearbyShops()
        await Promise.all([
            getCategories(),
            getProducts()
        ]);

    }

    async function getNearbyShops() {
        try {
            const result = await locationService.getNearbyShops();
            currentLocation.value = result.currentLocation;
            nearbyShops.value = result.nearbyShops;

        } catch (error) {
            console.error('获取位置信息失败:', error);
        } finally {
            const shop = await api.shop.getShop({id: nearbyShops.value[0].id});
            currentShop.value = {
                ...shop,
                distance: nearbyShops.value[0].distance
            }
        }
    }

    async function getCategories() {
        try {
            categories.value = await api.category.getCategories()
        } catch (error) {
            console.error('获取分类失败:', error)
        }
    }

    async function getProducts() {
        try {
            const products = await api.product.findByPriceRule(currentShop.value.priceRule.id)
            foods.value = products.map(food => ({
                ...food,
                count: 0
            }))
        } catch (error) {
            console.error('获取商品失败:', error)
        }
    }

    function updateCart(item) {
        const cartItem = cart.value.find(i => i.id === item.id)
        if (item.count === 0) {
            cart.value = cart.value.filter(i => i.id !== item.id)
        } else if (cartItem) {
            cartItem.count = item.count
        } else {
            cart.value.push({...item})
        }

        const foodItem = foods.value.find(i => i.id === item.id)
        if (foodItem) {
            foodItem.count = item.count
        }
    }

    function clearCart() {
        cart.value = []
        foods.value.forEach(item => item.count = 0)
    }

    async function submitOrder() {
        if (cart.value.length === 0) {
            showToast('请先选择商品')
            return false
        }

        try {
            const order = {
                shopId: currentShop.value.id,
                items: cart.value.map(item => ({
                    id: item.id,
                    count: item.count,
                    price: item.price
                })),
            }

            await api.order.createOrder(order)
            showSuccessToast('下单成功')
            clearCart()
            return true
        } catch (error) {
            console.error('下单失败:', error)
            showFailToast('下单失败，请重试')
            return false
        }
    }

    return {
        // 状态
        activeCategory,
        categories,
        foods,
        cart,
        nearbyShops,
        showCart,
        currentLocation,
        currentShop,
        // 计算属性
        currentFoods,
        totalPrice,
        totalCount,
        // 方法
        init,
        updateCart,
        clearCart,
        submitOrder
    }
}) 