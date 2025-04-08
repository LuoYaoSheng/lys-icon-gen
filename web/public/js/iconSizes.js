/**
 * iconSizes.js - 各平台图标尺寸定义
 */

const ICON_SIZES = {
  // iOS/iPadOS图标尺寸
  iOS: [
    { size: 20, name: "icon-20.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "1x", description: "通知图标@1x" },
    { size: 40, name: "icon-20@2x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "2x", description: "通知图标@2x" },
    { size: 60, name: "icon-20@3x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "3x", description: "通知图标@3x" },
    { size: 29, name: "icon-29.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "1x", description: "设置图标@1x" },
    { size: 58, name: "icon-29@2x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "2x", description: "设置图标@2x" },
    { size: 87, name: "icon-29@3x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "3x", description: "设置图标@3x" },
    { size: 40, name: "icon-40.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "1x", description: "Spotlight图标@1x" },
    { size: 80, name: "icon-40@2x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "2x", description: "Spotlight图标@2x" },
    { size: 120, name: "icon-40@3x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "3x", description: "Spotlight图标@3x" },
    { size: 76, name: "icon-76.png", folder: "AppIcon.appiconset", idiom: "ipad", scale: "1x", description: "iPad应用图标@1x" },
    { size: 152, name: "icon-76@2x.png", folder: "AppIcon.appiconset", idiom: "ipad", scale: "2x", description: "iPad应用图标@2x" },
    { size: 167, name: "icon-83.5@2x.png", folder: "AppIcon.appiconset", idiom: "ipad", scale: "2x", description: "iPad Pro应用图标@2x" },
    { size: 120, name: "icon-60@2x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "2x", description: "iPhone应用图标@2x" },
    { size: 180, name: "icon-60@3x.png", folder: "AppIcon.appiconset", idiom: "iphone", scale: "3x", description: "iPhone应用图标@3x" },
    { size: 1024, name: "icon-1024.png", folder: "AppIcon.appiconset", idiom: "ios-marketing", scale: "1x", description: "App Store图标" }
  ],
  
  // Android图标尺寸
  Android: [
    { size: 36, name: "ic_launcher.png", folder: "mipmap-ldpi", type: "launcher", description: "ldpi" },
    { size: 48, name: "ic_launcher.png", folder: "mipmap-mdpi", type: "launcher", description: "mdpi" },
    { size: 72, name: "ic_launcher.png", folder: "mipmap-hdpi", type: "launcher", description: "hdpi" },
    { size: 96, name: "ic_launcher.png", folder: "mipmap-xhdpi", type: "launcher", description: "xhdpi" },
    { size: 144, name: "ic_launcher.png", folder: "mipmap-xxhdpi", type: "launcher", description: "xxhdpi" },
    { size: 192, name: "ic_launcher.png", folder: "mipmap-xxxhdpi", type: "launcher", description: "xxxhdpi" },
    // 自适应图标
    { size: 108, name: "ic_launcher_foreground.png", folder: "mipmap-mdpi", type: "adaptive", description: "自适应图标 mdpi" },
    { size: 162, name: "ic_launcher_foreground.png", folder: "mipmap-hdpi", type: "adaptive", description: "自适应图标 hdpi" },
    { size: 216, name: "ic_launcher_foreground.png", folder: "mipmap-xhdpi", type: "adaptive", description: "自适应图标 xhdpi" },
    { size: 324, name: "ic_launcher_foreground.png", folder: "mipmap-xxhdpi", type: "adaptive", description: "自适应图标 xxhdpi" },
    { size: 432, name: "ic_launcher_foreground.png", folder: "mipmap-xxxhdpi", type: "adaptive", description: "自适应图标 xxxhdpi" }
  ],
  
  // macOS图标尺寸
  macOS: [
    { size: 16, name: "icon_16x16.png", folder: "AppIcon.appiconset", scale: "1x", description: "16x16@1x" },
    { size: 32, name: "icon_16x16@2x.png", folder: "AppIcon.appiconset", scale: "2x", description: "16x16@2x" },
    { size: 32, name: "icon_32x32.png", folder: "AppIcon.appiconset", scale: "1x", description: "32x32@1x" },
    { size: 64, name: "icon_32x32@2x.png", folder: "AppIcon.appiconset", scale: "2x", description: "32x32@2x" },
    { size: 128, name: "icon_128x128.png", folder: "AppIcon.appiconset", scale: "1x", description: "128x128@1x" },
    { size: 256, name: "icon_128x128@2x.png", folder: "AppIcon.appiconset", scale: "2x", description: "128x128@2x" },
    { size: 256, name: "icon_256x256.png", folder: "AppIcon.appiconset", scale: "1x", description: "256x256@1x" },
    { size: 512, name: "icon_256x256@2x.png", folder: "AppIcon.appiconset", scale: "2x", description: "256x256@2x" },
    { size: 512, name: "icon_512x512.png", folder: "AppIcon.appiconset", scale: "1x", description: "512x512@1x" },
    { size: 1024, name: "icon_512x512@2x.png", folder: "AppIcon.appiconset", scale: "2x", description: "512x512@2x" }
  ],
  
  // Windows图标尺寸
  Windows: [
    { size: 16, name: "Square16Logo.png", folder: "Assets", scale: "100", description: "Square16x16Logo" },
    { size: 24, name: "Square24Logo.png", folder: "Assets", scale: "100", description: "Square24x24Logo" },
    { size: 32, name: "Square32Logo.png", folder: "Assets", scale: "100", description: "Square32x32Logo" },
    { size: 44, name: "Square44Logo.png", folder: "Assets", scale: "100", description: "Square44x44Logo" },
    { size: 48, name: "Square48Logo.png", folder: "Assets", scale: "100", description: "Square48x48Logo" },
    { size: 64, name: "Square64Logo.png", folder: "Assets", scale: "100", description: "Square64x64Logo" },
    { size: 96, name: "Square96Logo.png", folder: "Assets", scale: "100", description: "Square96x96Logo" },
    { size: 128, name: "Square128Logo.png", folder: "Assets", scale: "100", description: "Square128x128Logo" },
    { size: 256, name: "Square256Logo.png", folder: "Assets", scale: "100", description: "Square256x256Logo" },
    { size: 200, name: "StoreLogo.png", folder: "Assets", scale: "100", description: "应用商店图标" }
  ],
  
  // watchOS图标尺寸
  watchOS: [
    { size: 48, name: "icon-24@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "notificationCenter", subtype: "38mm", scale: "2x", description: "通知中心38mm" },
    { size: 55, name: "icon-27-5@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "notificationCenter", subtype: "42mm", scale: "2x", description: "通知中心42mm" },
    { size: 58, name: "icon-29@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "companionSettings", scale: "2x", description: "设置" },
    { size: 87, name: "icon-29@3x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "companionSettings", scale: "3x", description: "设置" },
    { size: 80, name: "icon-40@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "appLauncher", subtype: "38mm", scale: "2x", description: "主屏幕38mm" },
    { size: 88, name: "icon-44@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "longLook", subtype: "42mm", scale: "2x", description: "长按42mm" },
    { size: 100, name: "icon-50@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "appLauncher", subtype: "44mm", scale: "2x", description: "主屏幕44mm" },
    { size: 172, name: "icon-86@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "quickLook", subtype: "38mm", scale: "2x", description: "短视图38mm" },
    { size: 196, name: "icon-98@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "quickLook", subtype: "42mm", scale: "2x", description: "短视图42mm" },
    { size: 216, name: "icon-108@2x.png", folder: "AppIcon.appiconset", idiom: "watch", role: "quickLook", subtype: "44mm", scale: "2x", description: "短视图44mm" },
    { size: 1024, name: "icon-1024.png", folder: "AppIcon.appiconset", idiom: "watch-marketing", scale: "1x", description: "App Store" }
  ]
};

// 平台文件格式
const PLATFORM_FORMATS = {
  iOS: "png",
  Android: "png",
  macOS: "png",
  Windows: "png",
  watchOS: "png"
};

// 平台文件夹名称
const PLATFORM_FOLDERS = {
  iOS: "iOS",
  Android: "Android",
  macOS: "macOS",
  Windows: "Windows",
  watchOS: "watchOS"
};

// 平台特定的资源文件生成配置
const PLATFORM_CONFIGS = {
  iOS: {
    needsContentsJson: true,
    assetsDir: "Assets.xcassets",
    iconsetDir: "AppIcon.appiconset"
  },
  macOS: {
    needsContentsJson: true,
    assetsDir: "Assets.xcassets",
    iconsetDir: "AppIcon.appiconset"
  },
  watchOS: {
    needsContentsJson: true,
    assetsDir: "Assets.xcassets",
    iconsetDir: "AppIcon.appiconset"
  },
  Android: {
    needsAdaptiveIcons: true,
    resDir: "res",
    mipmapDirs: ["mipmap-ldpi", "mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"],
    valuesDir: "values"
  },
  Windows: {
    needsManifest: false,
    assetsDir: "Assets"
  }
}; 