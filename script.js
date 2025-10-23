// 虚拟号码管理
class VirtualNumberManager {
    constructor() {
        this.storageKey = 'carMoveVirtualNumber';
        this.init();
    }

    init() {
        let numberData = this.getStoredNumber();
        
        if (!numberData || this.isExpired(numberData.timestamp)) {
            numberData = this.generateNewNumber();
        }
        
        this.currentNumber = numberData;
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
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : null;
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
        
        if (virtualNumberElement) {
            virtualNumberElement.textContent = this.currentNumber.number;
        }
        if (displayNumberElement) {
            displayNumberElement.textContent = this.currentNumber.number;
        }
    }

    getCurrentNumber() {
        return this.currentNumber.number;
    }
}

// 初始化虚拟号码管理器
const numberManager = new VirtualNumberManager();

// 生成二维码
function generateQRCode() {
    const virtualNumber = numberManager.getCurrentNumber();
    const qrData = `${window.location.origin}${window.location.pathname}?number=${virtualNumber}`;
    
    QRCode.toCanvas(document.getElementById('qrCode'), qrData, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) console.error(error);
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
    window.location.href = `tel:${number}`;
}

function copyNumber() {
    const number = numberManager.getCurrentNumber();
    navigator.clipboard.writeText(number).then(() => {
        alert('号码已复制到剪贴板');
    });
}

// URL参数处理
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const numberParam = urlParams.get('number');
    
    if (numberParam) {
        showContactSection();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    generateQRCode();
    handleUrlParams();
    
    // 更新有效期显示
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 15);
    document.querySelectorAll('.expiry-date').forEach(el => {
        el.textContent = expiryDate.toLocaleDateString('zh-CN');
    });
});