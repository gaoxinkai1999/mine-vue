// update.js
import {CapacitorUpdater} from '@capgo/capacitor-updater';
import {showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast} from "vant";
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import {useMyStore} from "@/stores/defineStore";


class UpdateManager {

    constructor() {
        this.isChecking = false;
    }

    // 初始化更新器
    async init() {
        try {
            // 通知应用准备就绪
            await CapacitorUpdater.notifyAppReady();


            // 检查更新
            await this.checkForUpdates();
        } catch (error) {
            console.error('初始化更新器失败:', error);
        }
    }

    // 检查更新
    async checkForUpdates() {
        if (this.isChecking) return;

        this.isChecking = true;
        try {


            // 获取内置版本和当前版本
            const builtinVersion = await CapacitorUpdater.getBuiltinVersion();
            const currentVersion = await CapacitorUpdater.current();

            console.log('内置版本:', JSON.stringify(builtinVersion, null, 2));
            console.log('当前版本:', JSON.stringify(currentVersion, null, 2));

            // 获取version.json的信息
            const versionInfo = await this.fetchVersionInfo();

            console.log('最新版本信息:', JSON.stringify(versionInfo, null, 2))
            // 判断是否需要更新
            const needUpdate =  this.checkForUpdateNeed(currentVersion, versionInfo);
            if (!needUpdate) {
                return;
            }

            await this.showUpdateDialog(versionInfo);

        } catch (error) {
            console.error('检查更新失败:', error);
            showFailToast('检查更新失败')
        } finally {
            this.isChecking = false;
        }
    }

    // 获取版本信息
    async fetchVersionInfo() {
        try {
            // 示例：使用时间戳  防止缓存版本信息
            const url = `http://btc.abocidee.com/updates/version.json?timestamp=${Date.now()}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('获取版本信息失败:', error);
            throw new Error('无法获取版本信息');
        }
    }

    /**
     * 检查是否需要更新应用版本
     *
     * 此函数通过比较当前应用版本和可用的更新版本信息，来决定是否需要更新
     * 它首先确定当前应用版本，然后根据更新信息和版本比较结果来判断是否有更新需求
     *
     * @param {Object} currentVersion - 当前应用的版本信息，包含原生版本和捆绑版本
     * @param {Object} versionInfo - 版本更新信息，包括是否需要更新和新的版本号
     * @returns {boolean} - 如果需要更新则返回true，否则返回false
     */
     checkForUpdateNeed(currentVersion, versionInfo) {

        // 确定当前应用使用的版本号如果是内置版本，就使用原生版本号，否则使用捆绑版本号
        const currentAppVersion = currentVersion.bundle.version === 'builtin'
            ? currentVersion.native
            : currentVersion.bundle.version;
        const store = useMyStore()
        store.changelog = versionInfo.changelog;
        store.version = versionInfo.version;

        // localStorage.setItem('version', currentAppVersion);
        // localStorage.setItem('changelog', versionInfo.changelog);
        // 判断是否有更新需求，并且当前版本是否小于新版本号
        return versionInfo.isUpdate ||
            this.compareVersions(currentAppVersion, versionInfo.version) < 0;
    }

    // 版本号比较方法
    compareVersions(version1, version2) {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            if (num1 < num2) return -1;
            if (num1 > num2) return 1;
        }
        return 0;
    }

    // 显示更新对话框
    async showUpdateDialog(versionInfo) {
        try {
            const message = versionInfo.changelog
                ? `发现新版本 ${versionInfo.version}\n\n更新内容:\n${versionInfo.changelog}`
                : `发现新版本 ${versionInfo.version}，是否立即更新？`;

            const result = await showConfirmDialog ({
                title: '版本更新',
                message,
                confirmButtonText: '立即更新',
                cancelButtonText: '稍后再说'
            });

            if (result === 'confirm') {
                await this.downloadAndInstall(versionInfo);
            }
        } catch (error) {
            console.log('用户取消更新');
        }
    }

    // 下载并安装更新
    async downloadAndInstall(versionInfo) {
        try {
            showLoadingToast({
                message: '正在下载更新...',
                forbidClick: true,
                loadingType: 'spinner',
            });

            // 下载更新
            const downloadResult = await CapacitorUpdater.download({
                version: versionInfo.version,
                url: versionInfo.url
            }, {
                changelog: versionInfo.changelog
            });

            console.log('下载结果:', downloadResult);

            if (!downloadResult) {
                showFailToast('下载更新失败')
                return;
            }
            showLoadingToast({
                message: '正在安装更新...',
                forbidClick: true,
                loadingType: 'spinner',
            });

            await CapacitorUpdater.set({
                id: downloadResult.id,
                version: versionInfo.version
            });
            showSuccessToast('更新成功，即将重启应用')


            // 延迟重启
            setTimeout(async () => {
                await CapacitorUpdater.reload();
            }, 1500);

        } catch (error) {
            console.error('更新失败:', error);
            showFailToast('更新失败')
            // await this.rollbackUpdate();
        }
    }

    // 回滚更新
    // async rollbackUpdate() {
    //     try {
    //         Toast.loading({
    //             message: '正在回滚...',
    //             forbidClick: true,
    //             duration: 0
    //         });
    //
    //         await CapacitorUpdater.reset();
    //         Toast.success('已回滚到之前版本');
    //
    //         // 延迟重启
    //         setTimeout(async () => {
    //             await CapacitorUpdater.reload();
    //         }, 1500);
    //
    //     } catch (error) {
    //         console.error('回滚失败:', error);
    //         Toast.fail('回滚失败');
    //     }
    // }


}

// 导出单例
export const updateManager = new UpdateManager();
