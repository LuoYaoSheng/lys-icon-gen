#!/bin/bash

# 设置变量
APP_PATH="dist/iconsize-darwin-x64/iconsize.app"
DMG_NAME="iconsize-3.0.0.dmg"
DMG_PATH="dist/$DMG_NAME"
VOLUME_NAME="iconsize 3.0.0"
ICON_PATH="src/assets/icon.icns"

# 检查应用是否存在
if [ ! -d "$APP_PATH" ]; then
  echo "错误: 找不到应用 $APP_PATH"
  exit 1
fi

# 创建临时DMG
echo "创建临时DMG..."
hdiutil create -volname "$VOLUME_NAME" -srcfolder "$APP_PATH" -ov -format UDRW "dist/temp.dmg"

# 挂载DMG
echo "挂载DMG..."
DEVICE=$(hdiutil attach -readwrite -noverify -noautoopen "dist/temp.dmg" | grep Apple_HFS | cut -d ' ' -f 1)
sleep 2

# 创建Applications链接
echo "创建Applications链接..."
pushd /Volumes/"$VOLUME_NAME"
ln -s /Applications Applications
popd

# 设置DMG窗口和图标
echo "设置DMG窗口和图标..."
# 这部分可能需要AppleScript或其他工具来完成

# 卸载DMG
echo "卸载DMG..."
hdiutil detach "$DEVICE"

# 压缩DMG
echo "压缩DMG..."
hdiutil convert "dist/temp.dmg" -format UDZO -o "$DMG_PATH"
rm "dist/temp.dmg"

echo "DMG创建完成: $DMG_PATH" 