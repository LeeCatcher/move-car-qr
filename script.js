// script.js - 修复版本

// 电话号码加密显示函数
function maskPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        return '号码无效';
    }
    
    if (phone.length < 7) {
        return phone;
    }
    
    try {
        // 显示前3位和后2位，中间用*号代替
        const prefix = phone.substring(0, 3);
        const suffix = phone.substring(phone.length - 2);
        const maskedLength = phone.length - 5; // 需要隐藏的位数
        
        return prefix + '*'.repeat(maskedLength) + suffix;
    } catch (error) {
        console.error('加密号码时出错:', error);
        return '号码格式错误';
    }
}

// 获取URL参数
function getUrlParameter(name) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    } catch (error) {
        console.error('获取URL参数时出错:', error);
        return null;
    }
}

// 验证手机号码格式
function validatePhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') {
        return false;
    }
    
    // 简单的手机号验证（中国手机号）
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 显示错误信息
function showError(message) {
    // 创建或显示错误消息元素
    let errorElement = document.getElementById('errorMessage');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'errorMessage';
        errorElement.className = 'error-message';
        document.querySelector('.contact-card').prepend(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// 隐藏错误信息
function hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// 拨打电话功能
function callNumber() {
    try {
        const phoneDisplay = document.getElementById('phoneDisplay');
        const realPhone = phoneDisplay.dataset.realPhone;
        
        if (realPhone && validatePhoneNumber(realPhone)) {
            // 使用tel:协议拨打电话
            window.location.href = `tel:${realPhone}`;
        } else {
            showError('无法获取有效的电话号码');
        }
    } catch (error) {
        console.error('拨打电话时出错:', error);
        showError('拨打电话失败，请稍后重试');
    }
}

// 初始化页面
function initializePage() {
    try {
        hideError();
        
        // 从URL参数获取电话号码
        const phoneParam = getUrlParameter('phone');
        
        if (phoneParam && validatePhoneNumber(phoneParam)) {
            // 显示加密后的电话号码
            const maskedPhone = maskPhoneNumber(phoneParam);
            document.getElementById('phoneDisplay').textContent = maskedPhone;
            
            // 保存真实号码到data属性，用于拨打电话
            document.getElementById('phoneDisplay').dataset.realPhone = phoneParam;
            
            console.log('电话号码加载成功:', phoneParam);
        } else {
            // 如果没有有效的电话号码参数
            document.getElementById('phoneDisplay').textContent = '请扫描有效二维码';
            document.getElementById('phoneDisplay').style.color = '#6c757d';
            
            // 如果是直接访问页面（没有参数），显示提示
            if (!phoneParam) {
                showError('请使用挪车二维码访问此页面');
            } else {
                showError('二维码中的电话号码无效');
            }
        }
        
        // 添加按钮交互效果
        const callButton = document.querySelector('.call-button');
        if (callButton) {
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
        }
        
        console.log('页面初始化完成');
    } catch (error) {
        console.error('页面初始化失败:', error);
        showError('页面初始化失败，请刷新页面重试');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟一点时间执行，确保DOM完全加载
    setTimeout(initializePage, 100);
});

// 添加全局错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
    showError('发生未知错误，请刷新页面');
});
