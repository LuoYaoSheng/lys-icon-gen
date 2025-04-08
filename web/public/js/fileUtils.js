/**
 * fileUtils.js - 文件处理工具
 */

// 用于创建文件结构的工具类
class FileUtils {
  /**
   * 创建目录结构
   * @param {JSZip} zip - JSZip实例
   * @param {string} path - 路径
   */
  static createDir(zip, path) {
    zip.folder(path);
  }

  /**
   * 创建iOS/macOS/watchOS的Contents.json文件
   * @param {JSZip} zip - JSZip实例
   * @param {string} platform - 平台名称
   * @param {Array} icons - 图标数组
   * @param {string} basePath - 基础路径
   */
  static createContentsJson(zip, platform, icons, basePath) {
    const platformConfig = PLATFORM_CONFIGS[platform];
    if (!platformConfig || !platformConfig.needsContentsJson) return;
    
    const appiconsetPath = `${basePath}/${platformConfig.assetsDir}/${platformConfig.iconsetDir}`;
    const images = icons.map(icon => {
      const entry = {
        size: `${Math.floor(icon.size / parseInt(icon.scale, 10))}x${Math.floor(icon.size / parseInt(icon.scale, 10))}`,
        idiom: icon.idiom || platform.toLowerCase(),
        filename: icon.name,
        scale: icon.scale || '1x'
      };
      
      if (icon.role) {
        entry.role = icon.role;
      }
      
      if (icon.subtype) {
        entry.subtype = icon.subtype;
      }
      
      return entry;
    });
    
    const contentsJson = {
      images,
      info: {
        version: 1,
        author: "Icon Generator"
      }
    };
    
    zip.file(`${appiconsetPath}/Contents.json`, JSON.stringify(contentsJson, null, 2));
  }

  /**
   * 创建Android的自适应图标相关XML文件
   * @param {JSZip} zip - JSZip实例
   * @param {string} basePath - Android基础路径
   */
  static createAndroidAdaptiveIconFiles(zip, basePath) {
    const platformConfig = PLATFORM_CONFIGS.Android;
    if (!platformConfig || !platformConfig.needsAdaptiveIcons) return;
    
    const resPath = `${basePath}/${platformConfig.resDir}`;
    const valuesPath = `${resPath}/${platformConfig.valuesDir}`;
    
    // 创建背景色XML
    const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>`;
    
    zip.file(`${valuesPath}/ic_launcher_background.xml`, backgroundXml);
    
    // 为每个密度创建自适应图标XML
    for (const mipmapDir of platformConfig.mipmapDirs) {
      const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@${mipmapDir}/ic_launcher_foreground"/>
</adaptive-icon>`;
      
      zip.file(`${resPath}/${mipmapDir}/ic_launcher.xml`, adaptiveIconXml);
    }
  }

  /**
   * 创建Windows的清单文件
   * @param {JSZip} zip - JSZip实例
   * @param {string} basePath - Windows基础路径
   */
  static createWindowsManifest(zip, basePath) {
    const platformConfig = PLATFORM_CONFIGS.Windows;
    if (!platformConfig || !platformConfig.needsManifest) return;
    
    // 如果需要生成Windows清单文件，可以在这里添加
  }
  
  /**
   * 添加图标文件到ZIP
   * @param {JSZip} zip - JSZip实例
   * @param {Array} icons - 图标数组
   * @param {string} platform - 平台名称
   * @param {string} basePath - 基础路径
   * @param {Object} options - 选项
   * @returns {Promise<void>} 完成Promise
   */
  static async addIconsToZip(zip, icons, platform, basePath, options = {}) {
    const { createSubFolders = true, prefixFilename = false } = options;
    const platformConfig = PLATFORM_CONFIGS[platform];
    
    // 创建Promise数组，用于等待所有图标处理完成
    const promises = icons.map(async (icon) => {
      let targetPath = basePath;
      let fileName = icon.name;
      
      // 创建平台特定的子文件夹结构
      if (createSubFolders && icon.folder) {
        if (platform === 'Android') {
          // Android使用多级文件夹结构
          targetPath = `${basePath}/${platformConfig.resDir}/${icon.folder}`;
        } else if ((platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') && platformConfig) {
          // iOS/macOS/watchOS使用Assets.xcassets/AppIcon.appiconset结构
          targetPath = `${basePath}/${platformConfig.assetsDir}/${platformConfig.iconsetDir}`;
        } else if (platform === 'Windows' && platformConfig) {
          // Windows使用简单的Assets文件夹
          targetPath = `${basePath}/${platformConfig.assetsDir}`;
        }
      }
      
      // 为非子文件夹模式添加前缀
      if (prefixFilename && !createSubFolders) {
        fileName = `${platform.toLowerCase()}-${fileName}`;
      }
      
      // 将Blob转换为ArrayBuffer并添加到ZIP
      if (icon.blob) {
        // 使用Promise包装FileReader操作
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = function(e) {
            zip.file(`${targetPath}/${fileName}`, e.target.result);
            resolve();
          };
          reader.onerror = function(error) {
            console.error('读取图标文件时出错:', error);
            reject(error);
          };
          reader.readAsArrayBuffer(icon.blob);
        });
      } else if (icon.dataURL) {
        // 如果有dataURL，从中提取base64数据
        const base64Data = icon.dataURL.split(',')[1];
        zip.file(`${targetPath}/${fileName}`, base64Data, {base64: true});
        return Promise.resolve(); // 返回已解决的Promise
      } else {
        console.warn(`图标 ${fileName} 没有有效的数据源`);
        return Promise.resolve(); // 返回已解决的Promise
      }
    });
    
    // 等待所有文件添加完成
    await Promise.all(promises);
  }
  
  /**
   * 创建平台资源
   * @param {JSZip} zip - JSZip实例
   * @param {Object} allIcons - 所有图标数据
   * @param {Object} options - 选项
   */
  static createResourceStructure(zip, allIcons, options = {}) {
    const { createSubFolders = true, prefixFilename = false } = options;
    
    // 为每个平台创建目录结构和资源文件
    Object.entries(allIcons).forEach(([platform, icons]) => {
      if (!icons || !icons.length) return;
      
      const basePath = createSubFolders ? platform : '';
      
      // 创建目录
      if (createSubFolders) {
        this.createDir(zip, platform);
        
        const platformConfig = PLATFORM_CONFIGS[platform];
        if (platformConfig) {
          // 创建平台特定的目录结构
          if (platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') {
            this.createDir(zip, `${platform}/${platformConfig.assetsDir}`);
            this.createDir(zip, `${platform}/${platformConfig.assetsDir}/${platformConfig.iconsetDir}`);
          } else if (platform === 'Android') {
            this.createDir(zip, `${platform}/${platformConfig.resDir}`);
            this.createDir(zip, `${platform}/${platformConfig.resDir}/${platformConfig.valuesDir}`);
            
            // 为Android创建mipmap目录
            platformConfig.mipmapDirs.forEach(dir => {
              this.createDir(zip, `${platform}/${platformConfig.resDir}/${dir}`);
            });
          } else if (platform === 'Windows') {
            this.createDir(zip, `${platform}/${platformConfig.assetsDir}`);
          }
        }
      }
      
      // 添加图标文件
      this.addIconsToZip(zip, icons, platform, basePath, options);
      
      // 创建平台特定的配置文件
      if (createSubFolders) {
        if (platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') {
          this.createContentsJson(zip, platform, icons, platform);
        } else if (platform === 'Android' && options.createAdaptiveIcons) {
          this.createAndroidAdaptiveIconFiles(zip, platform);
        } else if (platform === 'Windows') {
          this.createWindowsManifest(zip, platform);
        }
      }
    });
    
    return zip;
  }

  /**
   * 创建文件结构
   * @param {Object} allIcons - 所有生成的图标
   * @param {Array} platforms - 平台列表
   * @param {Boolean} createSubFolders - 是否创建子文件夹
   * @param {Boolean} prefixFilename - 是否为文件名添加前缀
   * @param {Boolean} createContentsJson - 是否创建Contents.json文件
   * @param {Boolean} createAdaptiveIcons - 是否创建自适应图标
   * @returns {Object} 文件结构
   */
  createFileStructure(allIcons, platforms, createSubFolders = true, prefixFilename = false, createContentsJson = true, createAdaptiveIcons = true) {
    const fileStructure = {};
    
    platforms.forEach(platform => {
      if (!allIcons[platform]) return;
      
      fileStructure[platform] = {
        icons: allIcons[platform],
        options: {
          createSubFolders,
          prefixFilename,
          createContentsJson,
          createAdaptiveIcons
        }
      };
    });
    
    return fileStructure;
  }
  
  /**
   * 创建ZIP文件
   * @param {Object} allIcons - 所有生成的图标
   * @param {Array} platforms - 平台列表
   * @param {Boolean} createSubFolders - 是否创建子文件夹
   * @param {Boolean} prefixFilename - 是否为文件名添加前缀
   * @param {Boolean} createContentsJson - 是否创建Contents.json文件
   * @param {Boolean} createAdaptiveIcons - 是否创建自适应图标
   * @returns {JSZip} ZIP文件
   */
  async createZipFile(allIcons, platforms, createSubFolders = true, prefixFilename = false, createContentsJson = true, createAdaptiveIcons = true) {
    // 确保JSZip已经加载
    if (typeof JSZip === 'undefined') {
      throw new Error('JSZip库未加载');
    }
    
    const zip = new JSZip();
    
    // 为每个平台创建目录结构和资源文件
    for (const platform of platforms) {
      const icons = allIcons[platform];
      if (!icons || !icons.length) continue;
      
      const basePath = createSubFolders ? platform : '';
      
      // 创建目录
      if (createSubFolders) {
        FileUtils.createDir(zip, platform);
        
        const platformConfig = PLATFORM_CONFIGS[platform];
        if (platformConfig) {
          // 创建平台特定的目录结构
          if (platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') {
            FileUtils.createDir(zip, `${platform}/${platformConfig.assetsDir}`);
            FileUtils.createDir(zip, `${platform}/${platformConfig.assetsDir}/${platformConfig.iconsetDir}`);
          } else if (platform === 'Android') {
            FileUtils.createDir(zip, `${platform}/${platformConfig.resDir}`);
            FileUtils.createDir(zip, `${platform}/${platformConfig.resDir}/${platformConfig.valuesDir}`);
            
            // 为Android创建mipmap目录
            platformConfig.mipmapDirs.forEach(dir => {
              FileUtils.createDir(zip, `${platform}/${platformConfig.resDir}/${dir}`);
            });
          } else if (platform === 'Windows') {
            FileUtils.createDir(zip, `${platform}/${platformConfig.assetsDir}`);
          }
        }
      }
      
      // 添加图标文件 - 等待图标添加完成
      await FileUtils.addIconsToZip(zip, icons, platform, basePath, {
        createSubFolders,
        prefixFilename
      });
      
      // 创建平台特定的配置文件
      if (createSubFolders) {
        if ((platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') && createContentsJson) {
          FileUtils.createContentsJson(zip, platform, icons, platform);
        } else if (platform === 'Android' && createAdaptiveIcons) {
          FileUtils.createAndroidAdaptiveIconFiles(zip, platform);
        } else if (platform === 'Windows') {
          FileUtils.createWindowsManifest(zip, platform);
        }
      }
    }
    
    return zip;
  }
} 