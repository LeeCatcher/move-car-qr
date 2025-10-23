// 虚拟号码管理
class VirtualNumberManager {
    constructor() {
        this.storageKey = 'carMoveVirtualNumber';
        this.init();
    }

    init() {
        // 首先检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        const urlNumber = urlParams.get('number');
        
        if (urlNumber) {
            // 如果有URL参数，使用参数中的号码
            this.currentNumber = {
                number: urlNumber,
                timestamp: Date.now(),
                expires: Date.now() + (15 * 365 * 24 * 60 * 60 * 1000)
            };
        } else {
            // 如果没有URL参数，使用存储的号码或生成新号码
            let numberData = this.getStoredNumber();
            
            if (!numberData || this.isExpired(numberData.timestamp)) {
                numberData = this.generateNewNumber();
            }
            
            this.currentNumber = numberData;
        }
        
        this.updateDisplay();
    }

    generateNewNumber() {
        // 生成以170开头的虚拟号码（11位）
        const prefix = '170';
        const randomPart = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
        const virtualNumber = prefix + randomPart;
        
        const numberData = {
            number: virtualNumber,
            timestamp: Date.now(),
            expires: Date.now() + (15 * 365 * 24 * 60 * 60 * 1000) // 15年
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(numberData));
        return numberData;
    }

    getStoredNumber() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            console.error('读取存储失败:', e);
            return null;
        }
    }

    isExpired(timestamp) {
        return Date.now() > (timestamp + (15 * 365 * 24 * 60 * 60 * 1000));
    }

    refreshNumber() {
        this.currentNumber = this.generateNewNumber();
        this.updateDisplay();
        this.generateQRCode();
    }

    updateDisplay() {
        const virtualNumberElement = document.getElementById('virtualNumber');
        const displayNumberElement = document.getElementById('displayNumber');
        
        if (virtualNumberElement && this.currentNumber) {
            virtualNumberElement.textContent = this.currentNumber.number;
        }
        if (displayNumberElement && this.currentNumber) {
            displayNumberElement.textContent = this.currentNumber.number;
        }
    }

    getCurrentNumber() {
        return this.currentNumber ? this.currentNumber.number : null;
    }
}

// 初始化虚拟号码管理器
let numberManager;

// 生成二维码
function generateQRCode() {
    const virtualNumber = numberManager.getCurrentNumber();
    if (!virtualNumber) {
        console.error('无法生成二维码：虚拟号码为空');
        return;
    }
    
    // 构建完整的URL（包含虚拟号码参数）
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('number', virtualNumber);
    const qrData = currentUrl.toString();
    
    // 清除之前的二维码
    const canvas = document.getElementById('qrCode');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    QRCode.toCanvas(canvas, qrData, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) {
            console.error('生成二维码失败:', error);
            // 备用方案：显示文本
            canvas.getContext('2d').font = '14px Arial';
            canvas.getContext('2d').fillText('二维码生成失败', 10, 50);
        }
    });
}

// 页面路由控制
function showContactSection() {
    document.getElementById('qrSection').style.display = 'none';
    document.getElementById('contactSection').style.display = 'block';
}

function showQR() {
    document.getElementById('qrSection').style.display = 'block';
    document.getElementById('contactSection').style.display = 'none';
}

// 功能函数
function refreshNumber() {
    numberManager.refreshNumber();
}

function callNumber() {
    const number = numberManager.getCurrentNumber();
    if (number) {
        window.location.href = `tel:${number}`;
    } else {
        alert('无法获取号码，请刷新页面重试');
    }
}

function copyNumber() {
    const number = numberManager.getCurrentNumber();
    if (number) {
        navigator.clipboard.writeText(number).then(() => {
            alert('号码已复制到剪贴板');
        }).catch(() => {
            // 备用复制方案
            const textArea = document.createElement('textarea');
            textArea.value = number;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('号码已复制到剪贴板');
        });
    } else {
        alert('无法获取号码，请刷新页面重试');
    }
}

// URL参数处理
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const numberParam = urlParams.get('number');
    
    if (numberParam) {
        showContactSection();
        // 确保号码显示正确
        setTimeout(() => {
            document.getElementById('displayNumber').textContent = numberParam;
        }, 100);
    } else {
        showQR();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    try {
        // 初始化号码管理器
        numberManager = new VirtualNumberManager();
        
        // 处理URL参数
        handleUrlParams();
        
        // 生成二维码（仅在二维码页面）
        if (document.getElementById('qrSection').style.display !== 'none') {
            generateQRCode();
        }
        
        // 更新有效期显示
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 15);
        document.querySelectorAll('.expiry-date').forEach(el => {
            el.textContent = expiryDate.toLocaleDateString('zh-CN');
        });
        
        console.log('挪车服务初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
        alert('服务初始化失败，请刷新页面重试');
    }
});
