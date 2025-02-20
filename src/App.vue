<template>

    <router-view></router-view>



</template>

<script setup>

import {updateManager} from "@/utils/update";
import {onMounted} from "vue";
import {App as CapApp} from '@capacitor/app';
import {useRouter} from 'vue-router';
import {showConfirmDialog} from "vant";


onMounted(async () => {
  await updateManager.init();
})
const router = useRouter();

const handleBackButton = ({canGoBack}) => {
  const currentPath = router.currentRoute.value.path;

  if (currentPath === '/') {
    // 在首页时弹出确认对话框
    showConfirmDialog({
      title: '退出应用',
      message: '确定要退出吗？',
    })
        .then(() => {
          CapApp.exitApp(); // 确认退出
        })
        .catch(() => {
          // 取消操作，无动作
        });
  } else {
    // 不在首页时正常返回或退出
    if (canGoBack) {
      router.back(); // 返回上一页
    } else {
      CapApp.exitApp(); // 无历史记录时退出
    }
  }
};

// 组件挂载时添加监听
onMounted(() => {
  CapApp.addListener('backButton', handleBackButton);
});

// export default {
//   name: 'App',
//   components: {},
//   async mounted() {
//     // 在应用创建时初始化更新管理器
//     await updateManager.init();
//   }
// }
</script>

<style>

</style>
