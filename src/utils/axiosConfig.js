import axios from 'axios';
import {showFailToast} from 'vant'; // 替换成你实际使用的 Toast 组件
// import { Loading } from 'element-ui'; // 如果需要 loading 功能，可以引入对应组件

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'https://new.abocidee.com/api',
    // baseURL: 'http://192.168.0.102:8085/api',// 替换为你的后端 API 根路径
    timeout: 5000, // 请求超时时间
});

// axios.defaults.baseURL = 'https://test.abocidee.com/api'
// axios.defaults.baseURL = 'https://g.abocidee.com/api'
// axios.defaults.baseURL = 'https://abocidee.com/api'
// axios.defaults.baseURL = 'http://localhost:8085/api'
// axios.defaults.baseURL = 'http://43.129.186.135:8085'
// axios.defaults.baseURL = 'http://192.144.135.26:8085'
// axios.defaults.baseURL = 'https://test.abocidee.com/api'

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 显示加载动画（如果需要）
        // loadingInstance = Loading.service({
        //     lock: true,
        //     text: 'Loading...',
        //     spinner: 'el-icon-loading',
        //     background: 'rgba(0, 0, 0, 0.7)'
        // });

        return config;
    },
    (error) => {
        // 请求错误处理
        showFailToast('请求发送失败');
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 隐藏加载动画（如果需要）
        // if (loadingInstance) loadingInstance.close();

        // 对响应数据处理
        if (response.data.status === 200) {
            return response.data;
        } else {
            return response.data;
        }
    },
    (error) => {
        // 隐藏加载动画（如果需要）
        // if (loadingInstance) loadingInstance.close();

        // 全局错误处理
        const message = error.response?.data?.message || '请求失败';
        showFailToast(message);
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default instance;
