const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const { generateIcons, exportIcons, createAndroidAdaptiveIconXml } = require('./iconGenerator');

// 创建存储实例
const store = new Store();

// 保持对窗口对象的全局引用，避免JavaScript对象被垃圾回收时窗口关闭
let mainWindow;

// 窗口尺寸配置
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

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: windowSizes.compact.width,
    height: windowSizes.compact.height,
    minWidth: 450,
    minHeight: 500,
    title: 'iconsize',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f5f7fa',
    vibrancy: 'under-window',
    visualEffectState: 'active'
  });
  
  // 加载index.html
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  // 当窗口准备好时显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // 如果是开发模式，打开开发者工具
  if (process.argv.includes('--debug')) {
    mainWindow.webContents.openDevTools();
  }
  
  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // 创建菜单
  createMenu();
}

// 设置窗口为紧凑大小
function setCompactWindowSize() {
  if (!mainWindow) return;
  
  const { width, height } = windowSizes.compact;
  mainWindow.setSize(width, height);
  mainWindow.center();
  mainWindow.setResizable(false);
}

// 设置窗口为展开大小
function setExpandedWindowSize(customSize) {
  if (!mainWindow) return;
  
  const size = customSize || windowSizes.expanded;
  const { width, height } = size;
  mainWindow.setSize(width, height);
  mainWindow.center();
  mainWindow.setResizable(true);
}

// 创建应用菜单
function createMenu() {
  const isMac = process.platform === 'darwin';
  
  const template = [
    ...(isMac ? [{
      label: 'iconsize',
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    }] : []),
    {
      label: '文件',
      submenu: [
        { 
          label: '打开图片...',
          accelerator: 'CmdOrCtrl+O',
          click: () => openImageDialog()
        },
        {
          label: '导出图标...',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.send('menu-export')
        },
        isMac ? { role: 'close', label: '关闭' } : { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        ...(isMac ? [
          { role: 'delete', label: '删除' },
          { role: 'selectAll', label: '全选' }
        ] : [
          { role: 'delete', label: '删除' },
          { type: 'separator' },
          { role: 'selectAll', label: '全选' }
        ])
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' },
        ...(process.argv.includes('--debug') ? [
          { type: 'separator' },
          { role: 'toggleDevTools', label: '切换开发者工具' }
        ] : [])
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: 'GitHub 仓库',
          click: async () => {
            await shell.openExternal('https://github.com/yourusername/icon-generator');
          }
        },
        {
          label: '关于',
          click: () => showAboutDialog()
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 显示关于对话框
function showAboutDialog() {
  dialog.showMessageBox(mainWindow, {
    title: '关于 iconsize',
    message: 'iconsize 图标生成器',
    detail: '版本 1.0.0\n\n开发者：罗耀生\n官网：https://i2kai.com\n公众号：极客第一行\n\n© 2023',
    buttons: ['确定'],
    icon: path.join(__dirname, '../assets/icon.png')
  });
}

// 打开图片对话框
function openImageDialog() {
  dialog.showOpenDialog(mainWindow, {
    title: '选择图片',
    filters: [
      { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      // 将选中的文件路径发送到渲染进程
      mainWindow.webContents.send('selected-image', result.filePaths[0]);
    }
  }).catch(err => {
    console.error('打开图片对话框时出错:', err);
  });
}

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createWindow();
  
  // 在macOS上，当点击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口关闭时退出应用，除了在macOS上
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 处理IPC通信

// 设置紧凑窗口大小
ipcMain.handle('set-compact-size', () => {
  setCompactWindowSize();
  return true;
});

// 设置展开窗口大小
ipcMain.handle('set-expanded-size', (event, customSize) => {
  setExpandedWindowSize(customSize);
  return true;
});

// 选择输出目录
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择输出目录',
    properties: ['openDirectory', 'createDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    // 保存最后使用的输出目录
    store.set('lastOutputPath', result.filePaths[0]);
  }
  
  return result;
});

// 获取配置
ipcMain.handle('get-config', () => {
  return {
    outputPath: store.get('lastOutputPath'),
    selectedPlatforms: store.get('selectedPlatforms', ['iOS', 'Android']),
    createSubFolders: store.get('createSubFolders', true),
    prefixFilename: store.get('prefixFilename', false),
    createContentsJson: store.get('createContentsJson', true),
    createAdaptiveIcons: store.get('createAdaptiveIcons', true)
  };
});

// 保存配置
ipcMain.handle('save-config', (event, config) => {
  if (config.outputPath) {
    store.set('lastOutputPath', config.outputPath);
  }
  
  if (config.selectedPlatforms) {
    store.set('selectedPlatforms', config.selectedPlatforms);
  }
  
  if (config.createSubFolders !== undefined) {
    store.set('createSubFolders', config.createSubFolders);
  }
  
  if (config.prefixFilename !== undefined) {
    store.set('prefixFilename', config.prefixFilename);
  }
  
  if (config.createContentsJson !== undefined) {
    store.set('createContentsJson', config.createContentsJson);
  }
  
  if (config.createAdaptiveIcons !== undefined) {
    store.set('createAdaptiveIcons', config.createAdaptiveIcons);
  }
  
  return true;
});

// 生成图标
ipcMain.handle('generate-icons', async (event, options) => {
  try {
    const { imagePath, platforms } = options;
    
    // 生成图标
    const icons = await generateIcons(imagePath, platforms);
    
    return icons;
  } catch (error) {
    console.error('生成图标时出错:', error);
    throw error;
  }
});

// 导出图标
ipcMain.handle('export-icons', async (event, options) => {
  try {
    const { icons, outputPath, createSubFolders, prefixFilename, createContentsJson, createAdaptiveIcons } = options;
    
    // 导出图标
    const result = await exportIcons(icons, outputPath, {
      createSubFolders,
      prefixFilename
    });
    
    // 如果启用了相关选项且存在Android平台图标，创建自适应图标XML文件
    if (createAdaptiveIcons && icons.Android && createSubFolders) {
      const androidOutputPath = path.join(outputPath, 'Android');
      createAndroidAdaptiveIconXml(androidOutputPath);
    }
    
    return result;
  } catch (error) {
    console.error('导出图标时出错:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// 打开目录
ipcMain.handle('open-directory', async (event, dirPath) => {
  try {
    // 检查目录是否存在
    if (!fs.existsSync(dirPath)) {
      throw new Error('指定的目录不存在');
    }
    
    // 打开目录
    await shell.openPath(dirPath);
    return true;
  } catch (error) {
    console.error('打开目录时出错:', error);
    throw error;
  }
});

// 切换窗口最大化状态
ipcMain.handle('toggle-maximize', () => {
  if (!mainWindow) return false;
  
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
  
  return true;
});

// 获取当前窗口尺寸
ipcMain.handle('get-window-size', () => {
  if (!mainWindow) return null;
  const [width, height] = mainWindow.getSize();
  return { width, height };
}); 