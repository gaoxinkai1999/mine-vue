// update.js
import {CapacitorUpdater} from '@capgo/capacitor-updater';
import {showConfirmDialog, showFailToast, showLoadingToast, showSuccessToast} from "vant";
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import {Filesystem, Directory} from '@capacitor/filesystem';
import {FileOpener} from '@capacitor-community/file-opener';
import {APP_VERSION} from '@/config/version.js'

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

            const currentVersion = APP_VERSION.version
            console.log('当前版本:', JSON.stringify(currentVersion));

            // 获取version.json的信息
            const versionInfo = await this.fetchVersionInfo();

            console.log('最新版本信息:', JSON.stringify(versionInfo, null, 2))

            // 检查版本号是否最新
            const isLatestVersion = this.compareVersions(currentVersion, versionInfo.version) >= 0;
            if (isLatestVersion) {
                console.log('当前版本已是最新，无需更新');
                return;
            }

            // 判断更新方式
            const forceDownloadApk = versionInfo.forceDownloadApk && versionInfo.apkUrl;
            if (forceDownloadApk) {
                console.log('需要强制下载APK');
                await this.downloadAndInstallApk(versionInfo.apkUrl);
            } else {
                console.log('进行热更新');
                await this.downloadAndInstall(versionInfo);
            }

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
            const url = `http://update.abocidee.com/updates/version.json`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('获取版本信息失败:', error);
            throw new Error('无法获取版本信息');
        }
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
        }
    }

    // 下载并安装APK
    async downloadAndInstallApk(apkUrl) {
        try {
            showLoadingToast({
                message: '准备下载...',
                forbidClick: true,
                loadingType: 'spinner',
            });

            // 生成临时文件名
            const fileName = `app-update-${Date.now()}.apk`;

            // 使用 fetch 获取文件大小
            const headResponse = await fetch(apkUrl, {method: 'HEAD'});
            const totalSize = parseInt(headResponse.headers.get('content-length') || '0');

            // 下载APK文件并显示进度
            const response = await fetch(apkUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 创建空文件
            await Filesystem.writeFile({
                path: fileName,
                data: '',
                directory: Directory.Documents,  // 改用 Documents 目录，确保文件可访问
                recursive: true
            });

            const reader = response.body.getReader();
            let receivedLength = 0;

            while (true) {
                const {done, value} = await reader.read();

                if (done) {
                    break;
                }

                // 将新的数据追加到文件
                await Filesystem.appendFile({
                    path: fileName,
                    data: this.arrayBufferToBase64(value.buffer),
                    directory: Directory.Documents
                });

                receivedLength += value.length;

                // 更新下载进度
                const progress = totalSize ? Math.round((receivedLength / totalSize) * 100) : 0;
                showLoadingToast({
                    message: `正在下载新版本...${progress}%`,
                    forbidClick: true,
                    loadingType: 'spinner',
                });
            }

            console.log('下载完成，文件大小:', receivedLength);

            // 获取文件的完整路径
            const fileInfo = await Filesystem.getUri({
                directory: Directory.Documents,
                path: fileName
            });

            console.log('文件路径信息:', fileInfo);

            // 直接打开 APK 进行安装
            await this.openApk(fileInfo.uri); // 新增调用打开 APK 的方法

        } catch (error) {
            console.error('下载或安装APK失败:', error);
            console.log('详细错误信息:', error.message);
            if (error.message.includes('HTTP error')) {
                showFailToast('下载失败：无法连接到服务器');
            } else if (error.message.includes('write') || error.message.includes('storage')) {
                showFailToast('保存文件失败：存储空间不足');
            } else if (error.message.includes('open') || error.message.includes('activity')) {
                showFailToast('打开安装程序失败，请检查是否允许安装未知来源应用');
            } else {
                showFailToast(`更新失败：${error.message}`);
            }

            // 打印更详细的错误信息以便调试
            console.error('完整错误对象:', JSON.stringify(error, null, 2));
        }
    }

    // 新增方法：打开 APK 文件进行安装
    async openApk(filePath) {
        try {
            showLoadingToast({
                message: '正在打开安装程序...',
                forbidClick: true,
                loadingType: 'spinner',
            });

            // 尝试打开APK进行安装
            await FileOpener.open({
                filePath: filePath,
                contentType: 'application/vnd.android.package-archive',
                openWithDefault: true
            });

            showSuccessToast('请按照提示安装新版本');
        } catch (openError) {
            console.error('打开APK失败，尝试第二种方式:', openError);
            // 如果第一种方式失败，尝试使用 Capacitor 的 Filesystem 复制文件到下载目录
            const downloadDir = await Filesystem.getUri({
                directory: Directory.External,
                path: `Download/${fileName}`
            });

            await Filesystem.copy({
                from: filePath,
                to: downloadDir.uri
            });

            await FileOpener.open({
                filePath: downloadDir.uri,
                contentType: 'application/vnd.android.package-archive',
                openWithDefault: true
            });

            showSuccessToast('请按照提示安装新版本');
        }
    }

    // 辅助方法：将 ArrayBuffer 转换为 Base64
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

}

// 导出单例
export const updateManager = new UpdateManager();
