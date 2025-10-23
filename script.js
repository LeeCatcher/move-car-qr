// script.js
// 电话号码加密显示函数
function maskPhoneNumber(phone) {
    if (!phone || phone.length < 7) return phone;
    
    // 显示前3位和后2位，中间用*号代替
    const prefix = phone.substring(0, 3);
    const suffix = phone.substring(phone.length - 2);
    const maskedLength = phone.length - 5; // 需要隐藏的位数
    
    return prefix + '*'.repeat(maskedLength) + suffix;
}

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 拨打电话功能
function callNumber() {
    const realPhone = document.getElementById('phoneDisplay').dataset.realPhone;
    
    if (realPhone) {
        // 使用tel:协议拨打电话
        window.location.href = `tel:${realPhone}`;
    } else {
        alert('无法获取电话号码，请稍后重试');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取电话号码
    const phoneParam = getUrlParameter('phone');
    
    if (phoneParam) {
        // 显示加密后的电话号码
        const maskedPhone = maskPhoneNumber(phoneParam);
        document.getElementById('phoneDisplay').textContent = maskedPhone;
        
        // 保存真实号码到data属性，用于拨打电话
        document.getElementById('phoneDisplay').dataset.realPhone = phoneParam;
        
        console.log('电话号码加载成功:', phoneParam);
    } else {
        // 如果没有电话号码参数，显示错误
        document.getElementById('phoneDisplay').textContent = '号码无效';
        document.getElementById('phoneDisplay').style.color = '#dc3545';
        
        console.error('未找到电话号码参数');
    }
    
    // 添加一些交互效果
    const callButton = document.querySelector('.call-button');
    
    callButton.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    callButton.addEventListener('mouseup', function() {
        this.style.transform = '';
    });
    
    callButton.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    callButton.addEventListener('touchend', function() {
        this.style.transform = '';
    });
});
