#!/usr/bin/env node

/**
 * electron-download.js
 * 
 * 手动下载Electron二进制文件的工具
 * 用于解决网络问题导致Docker构建失败的情况
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 配置信息
const ELECTRON_VERSION = '25.9.8';
const PLATFORMS = [
  { name: 'linux', arch: 'x64', filename: `electron-v${ELECTRON_VERSION}-linux-x64.zip` },
  { name: 'win32', arch: 'x64', filename: `electron-v${ELECTRON_VERSION}-win32-x64.zip` },
  { name: 'darwin', arch: 'x64', filename: `electron-v${ELECTRON_VERSION}-darwin-x64.zip` },
  { name: 'darwin', arch: 'arm64', filename: `electron-v${ELECTRON_VERSION}-darwin-arm64.zip` }
];

// 下载目录
const downloadDir = path.join(__dirname, 'electron-cache');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

/**
 * 下载文件
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`下载: ${url}`);
    console.log(`保存到: ${destPath}`);
    
    const file = fs.createWriteStream(destPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }
      
      const totalBytes = parseInt(response.headers['content-length'], 10);
      let downloadedBytes = 0;
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const progress = Math.round((downloadedBytes / totalBytes) * 100);
        process.stdout.write(`\r进度: ${progress}% (${(downloadedBytes / 1024 / 1024).toFixed(2)}MB/${(totalBytes / 1024 / 1024).toFixed(2)}MB)`);
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`\n下载完成: ${destPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // 删除部分下载的文件
      reject(err);
    });
  });
}

/**
 * 主函数
 */
async function main() {
  console.log(`===== Electron v${ELECTRON_VERSION} 下载工具 =====`);
  console.log(`下载目录: ${downloadDir}`);
  
  for (const platform of PLATFORMS) {
    const url = `https://github.com/electron/electron/releases/download/v${ELECTRON_VERSION}/${platform.filename}`;
    const filePath = path.join(downloadDir, platform.filename);
    
    try {
      if (fs.existsSync(filePath)) {
        console.log(`文件已存在: ${filePath}`);
        continue;
      }
      
      await downloadFile(url, filePath);
    } catch (error) {
      console.error(`下载 ${platform.filename} 失败:`, error.message);
    }
  }
  
  console.log('\n===== 下载完成 =====');
  console.log('您现在可以复制这些文件到Docker容器中的缓存目录或直接使用它们进行离线构建。');
  console.log('或者将electron-cache目录复制到Docker构建上下文中，然后修改Dockerfile以使用这些文件。');
}

// 执行主函数
main().catch(console.error); 