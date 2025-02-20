import {defineStore} from 'pinia'
import locationService from "@/utils/locationService.js";

// 使用 defineStore 定义 store
export const useMyStore = defineStore('my', {
    // 状态
    state: () => ({
        version: 'xxx',
        changelog: 'xxx',
        activeIndex: 0,


    }),

    // 计算属性
    getters: {},

    // 方法
    actions: {
        increment() {

        },
        async fetchSomeData() {
            // 异步操作
        },

    },

})
