const { contextBridge, ipcRenderer } = require('electron');

// 将ipcRenderer公开给渲染进程
// 注意：在本项目中我们禁用了contextIsolation，因此这个文件目前并没有真正起作用
// 但保留它是为了将来可能启用contextIsolation时使用

contextBridge.exposeInMainWorld('electron', {
  // 获取配置
  getConfig: () => ipcRenderer.invoke('get-config'),
  
  // 保存配置
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  
  // 选择目录
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // 生成图标
  generateIcons: (options) => ipcRenderer.invoke('generate-icons', options),
  
  // 导出图标
  exportIcons: (options) => ipcRenderer.invoke('export-icons', options),
  
  // 打开目录
  openDirectory: (path) => ipcRenderer.invoke('open-directory', path),
  
  // 接收从主进程发送的消息
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  
  // 移除监听器
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
}); 