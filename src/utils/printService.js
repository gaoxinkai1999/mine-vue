import {BleClient} from '@capacitor-community/bluetooth-le';
import {showLoadingToast ,showSuccessToast ,showFailToast} from 'vant';
import iconv from 'iconv-lite';
import 'vant/es/toast/style';
const SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002af1-0000-1000-8000-00805f9b34fb';
const TARGET_DEVICE_NAME = 'MPT-II';

// 初始化蓝牙
async function initializeBluetooth() {
    try {
        await BleClient.initialize();
        console.log("蓝牙初始化成功");
    } catch (err) {
        console.log("蓝牙初始化失败:", err.message);
        showFailToast("蓝牙初始化失败,请重试!");
        throw new Error(err);
    }
}

// 扫描指定名称的设备
async function scanForDeviceByName(targetName) {
    try {
        let foundDevice = null;

        // 开始扫描前先确保停止之前的扫描
        try {
            await BleClient.stopLEScan();
        } catch (e) {
            console.log('No active scanning to stop');
        }

        return new Promise((resolve, reject) => {
            let timeoutId;

            const scanCallback = (result) => {
                console.log('Scanned device:', result);
                if (result.device && result.device.name === targetName) {
                    foundDevice = result.device;
                    BleClient.stopLEScan();
                    clearTimeout(timeoutId);
                    resolve(foundDevice);
                }
            };

            // 开始扫描
            BleClient.requestLEScan(
                {
                    services: [],
                    namePrefix: '',
                    allowDuplicates: true
                },
                scanCallback
            ).catch(error => {
                console.error('Scan error:', error);
                reject(error);
            });

            // 设置超时
            timeoutId = setTimeout(async () => {
                await BleClient.stopLEScan();
                if (foundDevice) {
                    resolve(foundDevice);
                } else {
                    reject(new Error(`未找到名称为 ${targetName} 的设备`));
                }
            }, 5000);
        });
    } catch (error) {
        console.error('Scan error:', error);
        throw error;
    }
}

// 连接设备
async function connectDevice(device) {
    try {
        await BleClient.connect(device.deviceId, (disconnectData) => {
            console.log("设备已断开连接", disconnectData);
            showFailToast("设备连接断开");
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("设备连接成功");
        return {
            deviceId: device.deviceId,
            service: SERVICE_UUID,
            characteristic: CHARACTERISTIC_UUID
        };
    } catch (err) {
        console.log("设备连接失败:", err.message);
        showFailToast("设备连接失败,请重试!");
        throw new Error(err);
    }
}

// 连接到指定名称的设备
async function connectToDeviceByName() {
    try {
        await initializeBluetooth();

        console.log("开始扫描设备...");
        showLoadingToast({
            message: '正在搜索设备...',
            forbidClick: true,
            duration: 0
        });

        const device = await scanForDeviceByName(TARGET_DEVICE_NAME);


        if (device) {
            showLoadingToast({
                message: '正在连接设备...',
                forbidClick: true,
                duration: 0
            });

            const connection = await connectDevice(device);

            showSuccessToast("设备连接成功");
            return connection;
        } else {
            showFailToast("未找到指定名称的设备");
            return null;
        }
    } catch (err) {

        console.error("连接设备失败:", err);
        showFailToast(err.message || "连接设备失败,请重试!");
        throw err;
    }
}

// 发送打印数据
async function sendPrinterData(characteristic, cmd) {
    if (!characteristic) {
        console.log("打印失败:特性为空");
        throw new Error("打印机未连接");
    }

    // eslint-disable-next-line no-useless-catch
    try {
        const encodedCmd = iconv.encode(cmd, 'gbk');
        const maxChunkSize = 128;
        const chunks = [];

        for (let i = 0; i < encodedCmd.length; i += maxChunkSize) {
            chunks.push(encodedCmd.slice(i, i + maxChunkSize));
        }

        const totalChunks = chunks.length;
        for (let i = 0; i < totalChunks; i++) {
            const chunk = chunks[i];
            try {
                await BleClient.write(
                    characteristic.deviceId,
                    characteristic.service,
                    characteristic.characteristic,
                    chunk
                );
                console.log(`发送块 ${i + 1}/${totalChunks}`);
            } catch (err) {
                console.log("发送失败:", err.message);
                throw new Error("打印数据发送失败:" + err.message);
            }
        }

        return true;
    } catch (error) {
        throw error;
    }
}

// 格式化打印小票
export function formatReceipt(order, isPrinting) {
    const {shop, createTime, totalSalesAmount, orderDetails} = order;
    let receipt = "\n\n";

    if (isPrinting) {
        receipt += enlargeText(shop.name) + "\n\n";
    } else {
        receipt += `${shop.name}\n\n`;
    }

    receipt += `日期: ${createTime}\n`;
    receipt += "--------------------------------\n";
    receipt += padRight("商品名称", 12) + padRight("数量", 6) + padRight("单价", 8) + padRight("总价", 8) + '\n';
    orderDetails.forEach(detail => {
        const name = padRight(detail.product.name, 12);
        const num = padRight(String(detail.quantity), 6);
        const price = padRight(String(detail.salePrice), 8);
        const total = padRight(String(detail.totalSalesAmount), 8);
        receipt += `${name}${num}${price}${total}\n`;
    });
    receipt += "--------------------------------\n";
    receipt += `总计: ${totalSalesAmount}\n\n\n\n`;
    return receipt;
}

function padRight(str, length) {
    // eslint-disable-next-line no-control-regex
    const strLength = str.replace(/[^\x00-\xff]/g, 'xx').length;
    const padLength = Math.max(0, length - strLength);
    return str + ' '.repeat(padLength);
}

function enlargeText(text) {
    const enlargeCommand = '\x1B\x21\x11';
    const boldCommand = '\x1B\x45\x01';
    return enlargeCommand + boldCommand + text;
}

9

// 断开连接函数
async function disconnectDevice(deviceId) {
    if (!deviceId) return;

    try {
        // 使用 try-catch 捕获可能的错误,但不弹出 Toast
        await BleClient.disconnect(deviceId);
        console.log("设备已成功断开连接");
    } catch (error) {
        // 仅记录日志,不显示错误弹窗
        console.error("断开连接时发生错误:", error);
    }
}

export async function printOrder(order, onStatusChange = () => {
}) {
    let deviceId = null;
    try {
        onStatusChange('连接打印机...');

        // 连接设备
        const device = await connectToDeviceByName();
        deviceId = device.deviceId;

        // 打印
        onStatusChange('正在打印...');
        const printContent = formatReceipt(order, true);
        await sendPrinterData(device, printContent);

        // 打印成功后主动断开连接
        onStatusChange('断开连接...');
        await disconnectDevice(deviceId);

        // 成功提示
        showSuccessToast('打印成功');
    } catch (error) {
        console.error('打印过程出错:', error);

        // 如果连接过,尝试断开连接
        if (deviceId) {
            await disconnectDevice(deviceId);
        }

        // 错误提示
        showFailToast(error.message || '打印失败');
        throw error;
    } finally {
        onStatusChange('');
    }
}