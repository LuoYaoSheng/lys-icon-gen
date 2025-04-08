#!/bin/bash

# 确保在desktop目录下运行
cd "$(dirname "$0")/../../.."

# 设置变量
APP_NAME="iconsize"
APP_VERSION="3.0.0"
APP_PATH="dist/$APP_NAME-darwin-x64/$APP_NAME.app"
DMG_NAME="$APP_NAME-$APP_VERSION"
VOLUME_NAME="$APP_NAME $APP_VERSION"
BACKGROUND_FILE="src/assets/dmg/background.png"
ICON_FILE="src/assets/app.icns"
DMG_PATH="dist/$DMG_NAME.dmg"
TMP_DMG_PATH="dist/tmp.dmg"
TMP_DIR="dist/dmg-tmp"
VOLUME_ICON_FILE="src/assets/dmg/VolumeIcon.icns"

# 检查应用是否存在
if [ ! -d "$APP_PATH" ]; then
    echo "错误：找不到应用 $APP_PATH"
    exit 1
fi

# 创建临时目录
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
mkdir -p "$TMP_DIR/.background"

# 复制应用和创建Applications链接
cp -R "$APP_PATH" "$TMP_DIR"
ln -s /Applications "$TMP_DIR/Applications"

# 复制背景图片
cp "$BACKGROUND_FILE" "$TMP_DIR/.background/background.png"

# 如果有卷图标，复制它
if [ -f "$VOLUME_ICON_FILE" ]; then
    cp "$VOLUME_ICON_FILE" "$TMP_DIR/.VolumeIcon.icns"
fi

# 创建临时DMG
echo "创建临时DMG..."
hdiutil create -srcfolder "$TMP_DIR" -volname "$VOLUME_NAME" -fs HFS+ \
      -fsargs "-c c=64,a=16,e=16" -format UDRW "$TMP_DMG_PATH"

# 挂载临时DMG
echo "挂载临时DMG..."
DEVICE=$(hdiutil attach -readwrite -noverify -noautoopen "$TMP_DMG_PATH" | \
         grep Apple_HFS | cut -d ' ' -f 1)
sleep 2

# 设置DMG的窗口和图标位置
echo "设置DMG窗口属性..."
VOLUME_PATH="/Volumes/$VOLUME_NAME"

# 设置窗口大小和位置
echo '
tell application "Finder"
    tell disk "'$VOLUME_NAME'"
        open
        set current view of container window to icon view
        set toolbar visible of container window to false
        set statusbar visible of container window to false
        set the bounds of container window to {400, 100, 920, 480}
        set theViewOptions to the icon view options of container window
        set arrangement of theViewOptions to not arranged
        set icon size of theViewOptions to 72
        set background picture of theViewOptions to file ".background:background.png"
        
        set position of item "'$APP_NAME'.app" of container window to {150, 170}
        set position of item "Applications" of container window to {380, 170}
        
        update without registering applications
        delay 5
        close
    end tell
end tell
' | osascript

# 如果有卷图标，设置它
if [ -f "$VOLUME_PATH/.VolumeIcon.icns" ]; then
    echo "设置卷图标..."
    SetFile -a C "$VOLUME_PATH"
fi

# 确保所有写操作都完成
sync

# 卸载DMG
echo "卸载DMG..."
hdiutil detach "$DEVICE"

# 压缩DMG
echo "压缩DMG..."
rm -f "$DMG_PATH"
hdiutil convert "$TMP_DMG_PATH" -format UDZO -imagekey zlib-level=9 -o "$DMG_PATH"

# 清理
rm -f "$TMP_DMG_PATH"
rm -rf "$TMP_DIR"

echo "DMG创建完成：$DMG_PATH" 