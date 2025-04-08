/**
 * main.js - 图标生成器主要逻辑
 */

// 当页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 全局变量
let selectedFile = null;
let imageProcessor = null;
let selectedPlatforms = ['iOS', 'Android'];
let fileUtils = null;

// DOM元素缓存
const elements = {
    fileInput: document.getElementById('fileInput'),
    uploadBtn: document.getElementById('uploadBtn'),
    changeImageBtn: document.getElementById('changeImageBtn'),
    dropArea: document.getElementById('dropArea'),
    uploadContent: document.getElementById('uploadContent'),
    previewContent: document.getElementById('previewContent'),
    previewImage: document.getElementById('previewImage'),
    fileInfo: document.getElementById('fileInfo'),
    generateBtn: document.getElementById('generateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    resultSection: document.getElementById('resultSection'),
    resultContent: document.getElementById('resultContent'),
    downloadZipBtn: document.getElementById('downloadZipBtn'),
    notification: document.getElementById('notification'),
    notificationMessage: document.getElementById('notificationMessage'),
    platformCheckboxes: document.querySelectorAll('.platform-item input[type="checkbox"]'),
};

// 配置选项
const config = {
    createSubFolders: true,
    prefixFilename: false,
    createContentsJson: true,
    createAdaptiveIcons: true
};

/**
 * 初始化应用
 */
function initApp() {
    // 初始化图像处理器
    imageProcessor = new ImageProcessor();
    
    // 初始化文件工具
    fileUtils = new FileUtils();
    
    // 设置事件监听器
    setEventListeners();
    
    // 更新平台选择状态
    updatePlatformSelections();
    
    // 初始化配置选项
    initConfigOptions();
}

// 设置事件监听器
function setEventListeners() {
    // 文件输入相关
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
    elements.changeImageBtn.addEventListener('click', () => elements.fileInput.click());
    
    // 拖放区域
    elements.dropArea.addEventListener('dragover', handleDragOver);
    elements.dropArea.addEventListener('dragleave', handleDragLeave);
    elements.dropArea.addEventListener('drop', handleDrop);
    
    // 平台选择
    elements.platformCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handlePlatformChange);
    });
    
    // 配置选项
    document.getElementById('createSubFolders').addEventListener('change', updateConfig);
    document.getElementById('prefixFilename').addEventListener('change', updateConfig);
    document.getElementById('createContentsJson').addEventListener('change', updateConfig);
    document.getElementById('createAdaptiveIcons').addEventListener('change', updateConfig);
    
    // 按钮
    elements.generateBtn.addEventListener('click', handleGenerate);
    elements.resetBtn.addEventListener('click', resetApp);
    elements.downloadZipBtn.addEventListener('click', downloadAllIcons);
    
    // 结果标签切换
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('result-tab')) {
            filterResults(e.target.dataset.platform);
        }
    });
}

// 初始化配置选项
function initConfigOptions() {
    document.getElementById('createSubFolders').checked = config.createSubFolders;
    document.getElementById('prefixFilename').checked = config.prefixFilename;
    document.getElementById('createContentsJson').checked = config.createContentsJson;
    document.getElementById('createAdaptiveIcons').checked = config.createAdaptiveIcons;
}

// 更新配置
function updateConfig(e) {
    const target = e.target;
    config[target.id] = target.checked;
}

/**
 * 处理文件选择
 * @param {Event} event - 文件选择事件
 */
function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

/**
 * 处理拖放
 * @param {DragEvent} event - 拖放事件
 */
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.dropArea.classList.remove('active');
    
    const dt = event.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        processFile(files[0]);
    }
}

/**
 * 处理拖拽经过
 * @param {DragEvent} event - 拖拽事件
 */
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.dropArea.classList.add('active');
}

/**
 * 处理拖拽离开
 * @param {DragEvent} event - 拖拽事件
 */
function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.dropArea.classList.remove('active');
}

/**
 * 处理平台选择变更
 * @param {Event} event - 平台选择变更事件
 */
function handlePlatformChange(event) {
    updatePlatformSelections();
    
    // 如果至少选择了一个平台并且有文件，则启用生成按钮
    elements.generateBtn.disabled = !(selectedPlatforms.length > 0 && selectedFile);
}

/**
 * 更新平台选择
 */
function updatePlatformSelections() {
    selectedPlatforms = [];
    elements.platformCheckboxes.forEach(checkbox => {
        const platformContainer = checkbox.closest('.platform-item');
        if (checkbox.checked) {
            selectedPlatforms.push(checkbox.value);
            platformContainer.classList.add('selected');
        } else {
            platformContainer.classList.remove('selected');
        }
    });
}

/**
 * 处理文件
 * @param {File} file - 选中的文件
 */
async function processFile(file) {
    // 检查文件类型
    if (!file.type.match('image.*')) {
        showNotification('请选择有效的图像文件', 'error');
        return;
    }
    
    // 检查文件大小（不超过5MB）
    if (file.size > 5 * 1024 * 1024) {
        showNotification('文件大小不能超过5MB', 'error');
        return;
    }
    
    try {
        // 保存所选文件
        selectedFile = file;
        
        // 加载图像
        await imageProcessor.loadImage(URL.createObjectURL(file));
        
        // 更新预览
        elements.previewImage.src = imageProcessor.getImage().src;
        
        // 显示预览内容，隐藏上传内容
        elements.uploadContent.style.display = 'none';
        elements.previewContent.style.display = 'flex';
        
        // 修改拖放区域的鼠标样式
        elements.dropArea.style.cursor = 'default';
        
        // 更新文件信息
        const fileSize = formatFileSize(file.size);
        elements.fileInfo.textContent = `文件名: ${file.name} | 大小: ${fileSize} | 尺寸: ${imageProcessor.getWidth()}×${imageProcessor.getHeight()}px`;
        
        // 检查图像是否为正方形
        if (!imageProcessor.isSquare()) {
            showNotification('警告：图像不是正方形，可能会导致图标变形', 'warning', 5000);
        }
        
        // 如果至少选择了一个平台，则启用生成按钮
        elements.generateBtn.disabled = selectedPlatforms.length === 0;
        
        // 显示成功通知
        showNotification('图像已成功加载', 'success');
    } catch (error) {
        console.error('处理图像时出错:', error);
        showNotification('处理图像时出错: ' + error.message, 'error');
    }
}

/**
 * 处理生成按钮点击
 */
async function handleGenerate() {
    if (!selectedFile || !imageProcessor || selectedPlatforms.length === 0) {
        showNotification('请选择图像并至少选择一个平台', 'error');
        return;
    }
    
    try {
        // 显示加载动画或指示器
        showNotification('正在生成图标，请稍候...', 'info', 0);
        
        // 为每个所选平台分别生成图标
        const allIcons = {};
        
        // 逐个处理每个平台
        for (const platform of selectedPlatforms) {
            allIcons[platform] = await imageProcessor.generatePlatformIcons(platform);
        }
        
        // 根据配置创建文件结构
        const fileStructure = fileUtils.createFileStructure(
            allIcons,
            selectedPlatforms,
            config.createSubFolders,
            config.prefixFilename,
            config.createContentsJson,
            config.createAdaptiveIcons
        );
        
        // 显示下载按钮
        showDownloadSection(selectedPlatforms);
        
        // 隐藏通知
        hideNotification();
        
        // 滚动到结果部分
        elements.resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // 显示成功通知
        showNotification('图标已成功生成，可以下载', 'success');
    } catch (error) {
        console.error('生成图标时出错:', error);
        showNotification('生成图标时出错: ' + error.message, 'error');
    }
}

/**
 * 显示下载部分
 * @param {Array} platforms - 选择的平台
 */
function showDownloadSection(platforms) {
    // 清除现有内容
    elements.resultContent.innerHTML = '';
    
    // 创建下载信息
    const downloadInfo = document.createElement('div');
    downloadInfo.className = 'download-info';
    
    const platformList = document.createElement('div');
    platformList.className = 'platform-list';
    platformList.innerHTML = `<p>已生成以下平台的图标:</p>`;
    
    const platformUl = document.createElement('ul');
    platforms.forEach(platform => {
        const li = document.createElement('li');
        li.textContent = platform;
        platformUl.appendChild(li);
    });
    
    platformList.appendChild(platformUl);
    downloadInfo.appendChild(platformList);
    
    // 添加下载按钮说明
    const downloadHint = document.createElement('p');
    downloadHint.className = 'download-hint';
    downloadHint.textContent = '点击下面的按钮下载所有生成的图标 (ZIP格式)';
    downloadInfo.appendChild(downloadHint);
    
    elements.resultContent.appendChild(downloadInfo);
    
    // 显示结果部分
    elements.resultSection.style.display = 'block';
}

/**
 * 过滤结果
 * @param {String} platform - 平台名称
 */
function filterResults(platform) {
    // 更新活动标签
    document.querySelectorAll('.result-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.platform === platform);
    });
    
    // 过滤图标项
    document.querySelectorAll('.icon-item').forEach(item => {
        if (platform === 'all' || item.dataset.platform === platform) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * 下载所有图标
 */
async function downloadAllIcons() {
    if (!selectedFile || !imageProcessor) {
        showNotification('没有可供下载的图标', 'error');
        return;
    }
    
    try {
        showNotification('正在准备下载...', 'info', 0);
        
        // 为每个所选平台分别生成图标
        const allIcons = {};
        
        // 逐个处理每个平台
        for (const platform of selectedPlatforms) {
            allIcons[platform] = await imageProcessor.generatePlatformIcons(platform);
        }
        
        // 创建一个ZIP文件
        const zip = await fileUtils.createZipFile(
            allIcons,
            selectedPlatforms,
            config.createSubFolders,
            config.prefixFilename,
            config.createContentsJson,
            config.createAdaptiveIcons
        );
        
        // 下载ZIP文件
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // 创建一个下载链接
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(zipBlob);
        
        link.href = objectUrl;
        link.download = 'app-icons.zip';
        document.body.appendChild(link);
        link.click();
        
        // 清理
        setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            document.body.removeChild(link);
        }, 100);
        
        // 隐藏"正在准备下载"通知并显示成功通知
        hideNotification();
        showNotification('下载已开始', 'success');
    } catch (error) {
        console.error('创建ZIP文件时出错:', error);
        hideNotification();
        showNotification('创建ZIP文件时出错: ' + error.message, 'error');
    }
}

/**
 * 重置应用
 */
function resetApp() {
    // 重置文件输入
    elements.fileInput.value = '';
    selectedFile = null;
    
    // 显示上传内容，隐藏预览内容
    elements.uploadContent.style.display = 'flex';
    elements.previewContent.style.display = 'none';
    
    // 恢复拖放区域的鼠标样式
    elements.dropArea.style.cursor = 'pointer';
    
    // 隐藏结果部分
    elements.resultSection.style.display = 'none';
    
    // 禁用生成按钮
    elements.generateBtn.disabled = true;
    
    // 重置图像处理器
    if (imageProcessor) {
        imageProcessor.reset();
    }
    
    // 重置预览图像
    elements.previewImage.src = '';
    elements.fileInfo.textContent = '未选择文件';
    
    // 显示通知
    showNotification('应用已重置', 'info');
}

/**
 * 显示通知
 * @param {String} message - 通知消息
 * @param {String} type - 通知类型（'info', 'success', 'error', 'warning'）
 * @param {Number} duration - 通知持续时间（毫秒），0表示不自动隐藏
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 设置消息
    elements.notificationMessage.textContent = message;
    
    // 设置类型
    elements.notification.className = 'notification';
    elements.notification.classList.add(`notification-${type}`);
    
    // 显示通知
    elements.notification.classList.add('show');
    
    // 如果指定了持续时间，则在指定时间后隐藏通知
    if (duration > 0) {
        setTimeout(() => {
            hideNotification();
        }, duration);
    }
}

/**
 * 隐藏通知
 */
function hideNotification() {
    elements.notification.classList.remove('show');
}

/**
 * 格式化文件大小
 * @param {Number} bytes - 字节数
 * @returns {String} 格式化后的大小
 */
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

/**
 * 初始化标签页
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-nav button');
    const resultTabs = document.querySelectorAll('.result-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有标签的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前标签的active类
            this.classList.add('active');
        });
    });
    
    resultTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            
            // 移除所有标签的active类
            resultTabs.forEach(t => t.classList.remove('active'));
            // 添加当前标签的active类
            this.classList.add('active');
            
            // 显示相应的平台结果
            showPlatformResult(platform);
        });
    });
}

/**
 * 显示指定平台的结果
 * @param {String} platform - 平台名称
 */
function showPlatformResult(platform) {
    const resultGroups = document.querySelectorAll('.result-group');
    
    resultGroups.forEach(group => {
        if (platform === 'all' || group.getAttribute('data-platform') === platform) {
            group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}

// 添加重置按钮事件
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetApp);
    }
}); 