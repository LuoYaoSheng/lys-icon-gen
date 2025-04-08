// 引入必要的模块
const { ipcRenderer } = require('electron');

// 全局变量
let currentImage = null;
let selectedPlatforms = ['iOS', 'Android'];
const platformSizes = {
  iOS: ['180x180', '120x120', '87x87', '80x80', '60x60', '58x58', '40x40', '29x29', '20x20'],
  Android: ['192x192', '144x144', '96x96', '72x72', '48x48', '36x36'],
  macOS: ['1024x1024', '512x512', '256x256', '128x128', '64x64', '32x32', '16x16'],
  Windows: ['256x256', '128x128', '96x96', '64x64', '48x48', '32x32', '16x16'],
  watchOS: ['1024x1024', '216x216', '196x196', '172x172', '100x100', '88x88', '66x66', '58x58', '55x55', '48x48', '40x40']
};
let generatedIcons = {};
let configLoaded = false;
let isWindowExpanded = false;

// 窗口尺寸配置 - 与主进程保持一致
const windowSizes = {
  compact: {
    width: 500,
    height: 700
  },
  expanded: {
    width: 900,
    height: 900
  }
};

// DOM 元素
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const imageInfo = document.getElementById('imageInfo');
const previewControls = document.getElementById('previewControls');
const reuploadButton = document.getElementById('reuploadButton');
const rightPanel = document.getElementById('rightPanel');
const platformCheckboxes = document.querySelectorAll('.platform-checkbox');
const outputPathInput = document.getElementById('outputPath');
const browseButton = document.getElementById('browseButton');
const createSubFoldersCheckbox = document.getElementById('createSubFolders');
const prefixFilenameCheckbox = document.getElementById('prefixFilename');
const createContentsJsonCheckbox = document.getElementById('createContentsJson');
const createAdaptiveIconsCheckbox = document.getElementById('createAdaptiveIcons');
const generateButton = document.getElementById('generateButton');
const exportButton = document.getElementById('exportButton');
const openFolderButton = document.getElementById('openFolderButton');
const container = document.querySelector('.container');
const leftPanel = document.querySelector('.left-panel');
const main = document.querySelector('.main');

// 初始化应用
function initApp() {
  // 加载用户配置
  ipcRenderer.invoke('get-config').then(config => {
    if (config) {
      if (config.outputPath) {
        outputPathInput.value = config.outputPath;
      }
      
      if (config.selectedPlatforms && Array.isArray(config.selectedPlatforms)) {
        selectedPlatforms = config.selectedPlatforms;
        updatePlatformCheckboxes();
      }
      
      if (config.createSubFolders !== undefined) {
        createSubFoldersCheckbox.checked = config.createSubFolders;
      }
      
      if (config.prefixFilename !== undefined) {
        prefixFilenameCheckbox.checked = config.prefixFilename;
      }
      
      if (config.createContentsJson !== undefined) {
        createContentsJsonCheckbox.checked = config.createContentsJson;
      }
      
      if (config.createAdaptiveIcons !== undefined) {
        createAdaptiveIconsCheckbox.checked = config.createAdaptiveIcons;
      }
    }
    configLoaded = true;
  });
  
  // 初始隐藏右侧面板
  hideUIElements();
  
  // 初始设置窗口大小为小尺寸
  setCompactWindowSize();
  
  // 设置事件监听器
  setupEventListeners();
  
  // 监听来自主进程的消息
  ipcRenderer.on('selected-image', (event, imagePath) => {
    if (imagePath) {
      handleImagePath(imagePath);
    }
  });
  
  ipcRenderer.on('menu-export', () => {
    if (!exportButton.disabled) {
      exportIcons();
    }
  });
}

// 设置紧凑窗口大小
function setCompactWindowSize() {
  ipcRenderer.invoke('set-compact-size');
  isWindowExpanded = false;
  
  // 设置容器样式
  container.classList.add('compact-layout');
  leftPanel.classList.add('compact-layout');
  main.classList.add('compact-layout');
}

// 设置展开窗口大小
function setExpandedWindowSize() {
  if (!isWindowExpanded) {
    ipcRenderer.invoke('set-expanded-size');
    isWindowExpanded = true;
    
    // 移除紧凑样式
    container.classList.remove('compact-layout');
    leftPanel.classList.remove('compact-layout');
    main.classList.remove('compact-layout');
  }
}

// 隐藏UI元素
function hideUIElements() {
  if (rightPanel) {
    rightPanel.style.display = 'none';
  }
  
  previewContainer.style.display = 'none';
  imageInfo.style.display = 'none';
  previewControls.style.display = 'none';
}

// 显示UI元素
function showUIElements() {
  if (rightPanel) {
    rightPanel.style.display = 'block';
  }
  
  // 展开窗口大小
  setExpandedWindowSize();
}

// 设置事件监听器
function setupEventListeners() {
  // 文件拖放事件
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add('dragover');
  });
  
  dropArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
  });
  
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  
  // 点击上传区域时触发文件选择
  dropArea.addEventListener('click', () => {
    fileInput.click();
  });
  
  // 重新上传按钮事件
  reuploadButton.addEventListener('click', () => {
    fileInput.click();
  });
  
  // 文件选择事件
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });
  
  // 平台选择事件
  platformCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const platform = e.target.value;
      if (e.target.checked) {
        if (!selectedPlatforms.includes(platform)) {
          selectedPlatforms.push(platform);
        }
      } else {
        const index = selectedPlatforms.indexOf(platform);
        if (index !== -1) {
          selectedPlatforms.splice(index, 1);
        }
      }
      
      // 保存配置
      saveConfig();
    });
  });
  
  // 输出路径选择
  browseButton.addEventListener('click', async () => {
    const result = await ipcRenderer.invoke('select-directory');
    if (result && !result.canceled && result.filePaths.length) {
      outputPathInput.value = result.filePaths[0];
      saveConfig();
    }
  });
  
  // 配置选项事件
  createSubFoldersCheckbox.addEventListener('change', saveConfig);
  prefixFilenameCheckbox.addEventListener('change', saveConfig);
  createContentsJsonCheckbox.addEventListener('change', saveConfig);
  createAdaptiveIconsCheckbox.addEventListener('change', saveConfig);
  
  // 生成按钮事件
  generateButton.addEventListener('click', generateIcons);
  
  // 导出按钮事件
  exportButton.addEventListener('click', exportIcons);
  
  // 打开文件夹按钮事件
  openFolderButton.addEventListener('click', openOutputFolder);
}

// 处理选中的文件
function handleFile(file) {
  // 检查文件类型
  if (!file.type.match('image.*')) {
    showNotification('请选择有效的图片文件(JPG, PNG, GIF等)', 'error');
    return;
  }
  
  // 读取文件并显示预览
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentImage = {
        element: img,
        file: file,
        width: img.width,
        height: img.height,
        path: file.path,
        name: file.name
      };
      
      displayImagePreview();
      showUIElements(); // 显示右侧面板
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 处理图像路径（从菜单选择）
function handleImagePath(imagePath) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // 读取文件内容
    const buffer = fs.readFileSync(imagePath);
    
    // 获取文件名
    const fileName = path.basename(imagePath);
    
    // 创建Blob URL
    const blob = new Blob([buffer], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    
    // 加载图像
    const img = new Image();
    img.onload = () => {
      currentImage = {
        element: img,
        name: fileName,
        width: img.width,
        height: img.height,
        path: imagePath,
        url: url
      };
      
      displayImagePreview();
      showUIElements(); // 显示右侧面板
    };
    img.src = url;
  } catch (error) {
    console.error('读取图像文件时出错:', error);
    showNotification(`读取图像文件时出错: ${error.message}`, 'error');
  }
}

// 显示图像预览
function displayImagePreview() {
  if (!currentImage) return;
  
  // 隐藏上传区域
  dropArea.style.display = 'none';
  
  // 显示预览容器并添加图像
  previewContainer.innerHTML = '';
  const img = currentImage.element.cloneNode(true);
  img.style.maxHeight = '300px';
  img.style.maxWidth = '100%';
  previewContainer.appendChild(img);
  previewContainer.style.display = 'flex';
  
  // 等待一小段时间后添加显示类，触发动画
  setTimeout(() => {
    previewContainer.classList.add('show');
  }, 50);
  
  // 更新并显示图片信息
  imageInfo.textContent = `${currentImage.name} (${currentImage.width}×${currentImage.height})`;
  imageInfo.style.display = 'block';
  
  setTimeout(() => {
    imageInfo.classList.add('show');
  }, 100);
  
  // 显示重新上传按钮
  previewControls.style.display = 'flex';
  
  setTimeout(() => {
    previewControls.classList.add('show');
  }, 150);
  
  // 激活生成按钮
  generateButton.disabled = false;
  
  // 检查图片是否是方形
  if (currentImage.width !== currentImage.height) {
    showNotification('警告：图片不是正方形，这可能会导致图标被拉伸', 'warning');
  }
}

// 调整窗口大小以适应图片
function adjustWindowForImage() {
  if (!currentImage) return;
  
  // 计算预览容器的适当高度
  let containerHeight = Math.min(450, currentImage.height + 40); // 加上内边距
  
  // 如果图片高度超过标准预览高度，适当扩大窗口
  if (isWindowExpanded && currentImage.height > 300) {
    // 获取当前窗口尺寸
    ipcRenderer.invoke('get-window-size').then(size => {
      if (size) {
        const newHeight = Math.min(
          windowSizes.expanded.height + (containerHeight - 220),
          900 // 最大窗口高度
        );
        
        // 如果计算的新高度与当前高度不同，则调整窗口大小
        if (Math.abs(newHeight - size.height) > 50) {
          windowSizes.expanded.height = newHeight;
          ipcRenderer.invoke('set-expanded-size', windowSizes.expanded);
        }
      }
    });
  }
}

// 更新平台复选框状态
function updatePlatformCheckboxes() {
  platformCheckboxes.forEach(checkbox => {
    checkbox.checked = selectedPlatforms.includes(checkbox.value);
  });
}

// 保存用户配置
function saveConfig() {
  if (!configLoaded) return;
  
  const config = {
    outputPath: outputPathInput.value,
    selectedPlatforms: selectedPlatforms,
    createSubFolders: createSubFoldersCheckbox.checked,
    prefixFilename: prefixFilenameCheckbox.checked,
    createContentsJson: createContentsJsonCheckbox.checked,
    createAdaptiveIcons: createAdaptiveIconsCheckbox.checked
  };
  
  ipcRenderer.invoke('save-config', config);
}

// 生成图标
async function generateIcons() {
  if (!currentImage) {
    showNotification('请先选择一张图片', 'error');
    return;
  }
  
  if (selectedPlatforms.length === 0) {
    showNotification('请至少选择一个目标平台', 'error');
    return;
  }
  
  // 显示加载状态
  generateButton.disabled = true;
  generateButton.textContent = '生成中...';
  showNotification('正在生成图标，请稍候...', 'info');
  
  try {
    // 清空之前生成的图标
    generatedIcons = {};
    
    // 调用主进程生成图标
    const options = {
      imagePath: currentImage.path,
      platforms: selectedPlatforms,
      createSubFolders: createSubFoldersCheckbox.checked,
      prefixFilename: prefixFilenameCheckbox.checked,
      createContentsJson: createContentsJsonCheckbox.checked,
      createAdaptiveIcons: createAdaptiveIconsCheckbox.checked,
      outputPath: outputPathInput.value || null
    };
    
    const result = await ipcRenderer.invoke('generate-icons', options);
    generatedIcons = result;
    
    // 启用导出按钮
    exportButton.disabled = false;
    openFolderButton.disabled = options.outputPath ? false : true;
    
    showNotification('图标生成完成！', 'success');
  } catch (error) {
    console.error('生成图标出错:', error);
    showNotification(`生成图标时出错: ${error.message}`, 'error');
  } finally {
    // 恢复按钮状态
    generateButton.disabled = false;
    generateButton.textContent = '生成图标';
  }
}

// 导出图标
async function exportIcons() {
  if (Object.keys(generatedIcons).length === 0) {
    showNotification('没有可导出的图标', 'error');
    return;
  }
  
  if (!outputPathInput.value) {
    const result = await ipcRenderer.invoke('select-directory');
    if (result && !result.canceled && result.filePaths.length) {
      outputPathInput.value = result.filePaths[0];
      saveConfig();
    } else {
      showNotification('请选择输出目录', 'error');
      return;
    }
  }
  
  try {
    exportButton.disabled = true;
    exportButton.textContent = '导出中...';
    showNotification('正在导出图标，请稍候...', 'info');
    
    // 调用主进程保存图标
    const options = {
      icons: generatedIcons,
      outputPath: outputPathInput.value,
      createSubFolders: createSubFoldersCheckbox.checked,
      prefixFilename: prefixFilenameCheckbox.checked,
      createContentsJson: createContentsJsonCheckbox.checked,
      createAdaptiveIcons: createAdaptiveIconsCheckbox.checked
    };
    
    const result = await ipcRenderer.invoke('export-icons', options);
    
    if (result.success) {
      showNotification(`图标已成功导出到 ${result.path}`, 'success');
      openFolderButton.disabled = false;
    } else {
      showNotification(`导出图标时出错: ${result.error}`, 'error');
    }
  } catch (error) {
    console.error('导出图标出错:', error);
    showNotification(`导出图标时出错: ${error.message}`, 'error');
  } finally {
    exportButton.disabled = false;
    exportButton.textContent = '导出到文件夹';
  }
}

// 打开输出文件夹
function openOutputFolder() {
  if (outputPathInput.value) {
    ipcRenderer.invoke('open-directory', outputPathInput.value);
  } else {
    showNotification('请先选择输出目录', 'error');
  }
}

// 显示通知
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  const notificationContent = document.getElementById('notificationContent');
  
  notificationContent.textContent = message;
  notification.className = `notification ${type}`;
  
  // 添加show类触发动画
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 3秒后隐藏
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp); 