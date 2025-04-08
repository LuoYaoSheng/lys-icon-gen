#!/bin/bash

# 更新桌面数据库
update-desktop-database || true

# 更新图标缓存
touch --no-create /usr/share/icons/hicolor || true
gtk-update-icon-cache --quiet /usr/share/icons/hicolor || true

echo "iconsize 3.0.0 已安装完成。"
echo "运行命令 'iconsize' 或从应用程序菜单启动应用。" 