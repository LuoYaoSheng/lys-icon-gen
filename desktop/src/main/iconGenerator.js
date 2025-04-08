const fs = require('fs');
const path = require('path');
const { nativeImage } = require('electron');

// 定义各平台的图标尺寸和文件结构
const ICON_SIZES = {
  iOS: [
    { size: '180x180', name: 'icon-60@3x.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '3x' },
    { size: '120x120', name: 'icon-60@2x.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { size: '87x87', name: 'icon-29@3x.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '3x' },
    { size: '80x80', name: 'icon-40@2x.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { size: '60x60', name: 'icon-60.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '1x' },
    { size: '58x58', name: 'icon-29@2x.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '2x' },
    { size: '40x40', name: 'icon-40.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '1x' },
    { size: '29x29', name: 'icon-29.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '1x' },
    { size: '20x20', name: 'icon-20.png', folder: 'AppIcon.appiconset', idiom: 'iphone', scale: '1x' },
    // iPad 特定尺寸
    { size: '167x167', name: 'icon-83.5@2x.png', folder: 'AppIcon.appiconset', idiom: 'ipad', scale: '2x' },
    { size: '152x152', name: 'icon-76@2x.png', folder: 'AppIcon.appiconset', idiom: 'ipad', scale: '2x' },
    { size: '76x76', name: 'icon-76.png', folder: 'AppIcon.appiconset', idiom: 'ipad', scale: '1x' },
    // App Store
    { size: '1024x1024', name: 'icon-1024.png', folder: 'AppIcon.appiconset', idiom: 'ios-marketing', scale: '1x' }
  ],
  Android: [
    { size: '192x192', name: 'ic_launcher.png', folder: 'mipmap-xxxhdpi', type: 'launcher' },
    { size: '144x144', name: 'ic_launcher.png', folder: 'mipmap-xxhdpi', type: 'launcher' },
    { size: '96x96', name: 'ic_launcher.png', folder: 'mipmap-xhdpi', type: 'launcher' },
    { size: '72x72', name: 'ic_launcher.png', folder: 'mipmap-hdpi', type: 'launcher' },
    { size: '48x48', name: 'ic_launcher.png', folder: 'mipmap-mdpi', type: 'launcher' },
    { size: '36x36', name: 'ic_launcher.png', folder: 'mipmap-ldpi', type: 'launcher' },
    // 自适应图标
    { size: '432x432', name: 'ic_launcher_foreground.png', folder: 'mipmap-xxxhdpi', type: 'adaptive' },
    { size: '324x324', name: 'ic_launcher_foreground.png', folder: 'mipmap-xxhdpi', type: 'adaptive' },
    { size: '216x216', name: 'ic_launcher_foreground.png', folder: 'mipmap-xhdpi', type: 'adaptive' },
    { size: '162x162', name: 'ic_launcher_foreground.png', folder: 'mipmap-hdpi', type: 'adaptive' },
    { size: '108x108', name: 'ic_launcher_foreground.png', folder: 'mipmap-mdpi', type: 'adaptive' },
    { size: '81x81', name: 'ic_launcher_foreground.png', folder: 'mipmap-ldpi', type: 'adaptive' }
  ],
  macOS: [
    { size: '1024x1024', name: 'icon_1024x1024.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '512x512', name: 'icon_512x512@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '512x512', name: 'icon_512x512.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '256x256', name: 'icon_256x256@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '256x256', name: 'icon_256x256.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '128x128', name: 'icon_128x128@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '128x128', name: 'icon_128x128.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '64x64', name: 'icon_64x64@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '64x64', name: 'icon_64x64.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '32x32', name: 'icon_32x32@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '32x32', name: 'icon_32x32.png', folder: 'AppIcon.appiconset', scale: '1x' },
    { size: '16x16', name: 'icon_16x16@2x.png', folder: 'AppIcon.appiconset', scale: '2x' },
    { size: '16x16', name: 'icon_16x16.png', folder: 'AppIcon.appiconset', scale: '1x' }
  ],
  Windows: [
    { size: '256x256', name: 'Square256Logo.png', folder: 'Assets', scale: '100' },
    { size: '128x128', name: 'Square128Logo.png', folder: 'Assets', scale: '100' },
    { size: '96x96', name: 'Square96Logo.png', folder: 'Assets', scale: '100' },
    { size: '64x64', name: 'Square64Logo.png', folder: 'Assets', scale: '100' },
    { size: '48x48', name: 'Square48Logo.png', folder: 'Assets', scale: '100' },
    { size: '44x44', name: 'Square44Logo.png', folder: 'Assets', scale: '100' },
    { size: '32x32', name: 'Square32Logo.png', folder: 'Assets', scale: '100' },
    { size: '16x16', name: 'Square16Logo.png', folder: 'Assets', scale: '100' },
    // 应用商店图标
    { size: '200x200', name: 'StoreLogo.png', folder: 'Assets', scale: '100' }
  ],
  watchOS: [
    { size: '1024x1024', name: 'icon-1024.png', folder: 'AppIcon.appiconset', idiom: 'watch-marketing', scale: '1x' },
    // 42mm, 44mm, 45mm, 49mm
    { size: '216x216', name: 'icon-108@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'quickLook', subtype: '44mm' },
    { size: '196x196', name: 'icon-98@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'quickLook', subtype: '42mm' },
    { size: '172x172', name: 'icon-86@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'quickLook', subtype: '38mm' },
    // 通知中心
    { size: '100x100', name: 'icon-50@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'notificationCenter', subtype: '44mm' },
    { size: '88x88', name: 'icon-44@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'longLook', subtype: '42mm' },
    { size: '66x66', name: 'icon-33@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'notificationCenter', subtype: '38mm' },
    // 主屏幕
    { size: '58x58', name: 'icon-29@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'companionSettings' },
    { size: '55x55', name: 'icon-27-5@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'appLauncher', subtype: '42mm' },
    { size: '48x48', name: 'icon-24@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'appLauncher', subtype: '38mm' },
    { size: '40x40', name: 'icon-20@2x.png', folder: 'AppIcon.appiconset', idiom: 'watch', scale: '2x', role: 'appLauncher', subtype: '38mm' }
  ]
};

/**
 * 生成指定平台的所有图标
 * @param {string} imagePath - 源图像的路径
 * @param {Array<string>} platforms - 要生成图标的平台数组
 * @returns {Object} - 生成的图标对象，按平台分组
 */
async function generateIcons(imagePath, platforms) {
  try {
    // 读取源图像
    const sourceImage = nativeImage.createFromPath(imagePath);
    if (sourceImage.isEmpty()) {
      throw new Error('无法加载图像');
    }
    
    // 获取原始图像尺寸
    const sourceSize = sourceImage.getSize();
    
    // 检查图像是否为正方形
    if (sourceSize.width !== sourceSize.height) {
      console.warn('警告: 源图像不是正方形，这可能会导致图标被拉伸');
    }
    
    const result = {};
    
    // 为每个选定的平台生成图标
    for (const platform of platforms) {
      if (ICON_SIZES[platform]) {
        const platformIcons = [];
        
        for (const iconSpec of ICON_SIZES[platform]) {
          // 解析尺寸
          const [width, height] = iconSpec.size.split('x').map(Number);
          
          // 调整图像尺寸
          const resizedImage = sourceImage.resize({
            width,
            height,
            quality: 'best'
          });
          
          // 获取数据URL用于预览
          const dataUrl = resizedImage.toDataURL();
          
          // 保存到结果对象
          platformIcons.push({
            size: iconSpec.size,
            name: iconSpec.name,
            folder: iconSpec.folder,
            idiom: iconSpec.idiom,
            scale: iconSpec.scale,
            role: iconSpec.role,
            subtype: iconSpec.subtype,
            type: iconSpec.type,
            dataUrl,
            buffer: resizedImage.toPNG()
          });
        }
        
        result[platform] = platformIcons;
      } else {
        console.warn(`未知平台: ${platform}`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('生成图标时出错:', error);
    throw error;
  }
}

/**
 * 导出生成的图标到文件系统
 * @param {Object} icons - 生成的图标对象
 * @param {string} outputPath - 输出目录路径
 * @param {Object} options - 选项对象
 * @returns {Object} - 包含操作结果的对象
 */
async function exportIcons(icons, outputPath, options = {}) {
  try {
    const { createSubFolders = true, prefixFilename = false } = options;
    
    // 确保输出目录存在
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // 平台特定的导出处理
    for (const [platform, platformIcons] of Object.entries(icons)) {
      let platformOutputPath = outputPath;
      
      // 创建平台文件夹
      if (createSubFolders) {
        platformOutputPath = path.join(outputPath, platform);
        if (!fs.existsSync(platformOutputPath)) {
          fs.mkdirSync(platformOutputPath, { recursive: true });
        }
      }

      // 处理特殊平台的Content.json文件
      if (platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') {
        await createContentJsonFile(platform, platformIcons, platformOutputPath);
      }
      
      // 为每个图标创建相应的文件夹结构
      const folderMap = new Map(); // 用于跟踪已创建的文件夹
      
      for (const icon of platformIcons) {
        let targetFolder = platformOutputPath;
        let fileName = icon.name;
        
        // 创建平台特定的子文件夹结构
        if (icon.folder) {
          if (platform === 'Android') {
            // Android使用多级文件夹结构
            targetFolder = path.join(platformOutputPath, icon.folder);
          } else if ((platform === 'iOS' || platform === 'macOS' || platform === 'watchOS') && createSubFolders) {
            // iOS/macOS/watchOS使用Assets.xcassets/AppIcon.appiconset结构
            targetFolder = path.join(platformOutputPath, 'Assets.xcassets', icon.folder);
          } else if (platform === 'Windows' && createSubFolders) {
            // Windows使用简单的Assets文件夹
            targetFolder = path.join(platformOutputPath, icon.folder);
          }
          
          // 确保目标文件夹存在
          if (!folderMap.has(targetFolder)) {
            if (!fs.existsSync(targetFolder)) {
              fs.mkdirSync(targetFolder, { recursive: true });
            }
            folderMap.set(targetFolder, true);
          }
        }
        
        // 为非子文件夹模式添加前缀
        if (prefixFilename && !createSubFolders) {
          fileName = `${platform.toLowerCase()}-${fileName}`;
        }
        
        // 写入图标文件
        const filePath = path.join(targetFolder, fileName);
        fs.writeFileSync(filePath, icon.buffer);
      }
    }
    
    return {
      success: true,
      path: outputPath
    };
  } catch (error) {
    console.error('导出图标时出错:', error);
    return {
      success: false,
      error: error.message,
      path: outputPath
    };
  }
}

/**
 * 为iOS/macOS/watchOS创建Contents.json文件
 * @param {string} platform - 平台名称
 * @param {Array} icons - 图标数组
 * @param {string} outputPath - 输出路径
 */
async function createContentJsonFile(platform, icons, outputPath) {
  try {
    let targetFolder = outputPath;
    
    // 创建Assets.xcassets/AppIcon.appiconset文件夹结构
    const assetFolder = path.join(outputPath, 'Assets.xcassets');
    const appiconsetFolder = path.join(assetFolder, 'AppIcon.appiconset');
    
    if (!fs.existsSync(assetFolder)) {
      fs.mkdirSync(assetFolder, { recursive: true });
    }
    
    if (!fs.existsSync(appiconsetFolder)) {
      fs.mkdirSync(appiconsetFolder, { recursive: true });
    }
    
    // 构建Contents.json内容
    const images = icons.map(icon => {
      const entry = {
        size: icon.size.replace('x', 'x'),
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
        author: 'Icon Generator'
      }
    };
    
    // 写入Contents.json文件
    fs.writeFileSync(
      path.join(appiconsetFolder, 'Contents.json'),
      JSON.stringify(contentsJson, null, 2)
    );
  } catch (error) {
    console.error('创建Contents.json时出错:', error);
    throw error;
  }
}

/**
 * 创建Android的自适应图标XML文件
 * @param {string} outputPath - Android输出路径
 */
function createAndroidAdaptiveIconXml(outputPath) {
  try {
    const resFolder = path.join(outputPath, 'res');
    const valuesFolder = path.join(resFolder, 'values');
    
    // 创建所需文件夹
    if (!fs.existsSync(resFolder)) {
      fs.mkdirSync(resFolder, { recursive: true });
    }
    
    if (!fs.existsSync(valuesFolder)) {
      fs.mkdirSync(valuesFolder, { recursive: true });
    }
    
    // 创建background.xml (使用白色背景)
    const backgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>`;
    
    fs.writeFileSync(path.join(valuesFolder, 'ic_launcher_background.xml'), backgroundXml);
    
    // 为每个密度创建自适应图标XML
    const densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
    
    for (const density of densities) {
      const mipmapFolder = path.join(resFolder, `mipmap-${density}`);
      
      if (!fs.existsSync(mipmapFolder)) {
        fs.mkdirSync(mipmapFolder, { recursive: true });
      }
      
      // 创建ic_launcher.xml
      const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
      
      fs.writeFileSync(path.join(mipmapFolder, 'ic_launcher.xml'), adaptiveIconXml);
    }
  } catch (error) {
    console.error('创建Android自适应图标XML时出错:', error);
    throw error;
  }
}

module.exports = {
  generateIcons,
  exportIcons,
  ICON_SIZES,
  createAndroidAdaptiveIconXml
}; 