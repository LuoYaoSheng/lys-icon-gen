#!/bin/bash

# 创建打包目录
echo "创建部署包..."
rm -rf dist
mkdir -p dist

# 复制所有静态文件到dist目录
echo "复制静态文件..."
cp -r public/* dist/

# 创建一个简单的NGINX配置示例
echo "创建NGINX配置示例..."
cat > dist/nginx.conf.example << EOF
server {
    listen 80;
    server_name example.com;
    
    root /path/to/iconsize/web;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 防止访问.开头的隐藏文件
    location ~ /\. {
        deny all;
    }
    
    # 为静态资源设置缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# 创建压缩包
echo "创建压缩包..."
cd dist
zip -r ../iconsize-web.zip .
cd ..

echo "打包完成！"
echo "部署包: iconsize-web.zip"
echo "将压缩包解压到NGINX的根目录，并参考nginx.conf.example配置服务器" 