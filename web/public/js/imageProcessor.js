/**
 * imageProcessor.js - 图像处理功能
 */

class ImageProcessor {
  /**
   * 创建图像处理器实例
   */
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.image = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
  }

  /**
   * 加载图像
   * @param {File|Blob|String} source - 图像源（文件、Blob或URL）
   * @returns {Promise} 返回加载完成的Promise
   */
  loadImage(source) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.image = img;
        this.imageWidth = img.width;
        this.imageHeight = img.height;
        resolve({
          image: img,
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('图像加载失败'));
      };
      
      if (typeof source === 'string') {
        // 如果是URL字符串
        img.src = source;
      } else if (source instanceof File || source instanceof Blob) {
        // 如果是文件或Blob
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = () => {
          reject(new Error('文件读取失败'));
        };
        reader.readAsDataURL(source);
      } else {
        reject(new Error('不支持的图像源类型'));
      }
    });
  }

  /**
   * 获取当前加载的图像
   * @returns {Image} 图像对象
   */
  getImage() {
    return this.image;
  }

  /**
   * 获取图像宽度
   * @returns {Number} 图像宽度
   */
  getWidth() {
    return this.imageWidth;
  }

  /**
   * 获取图像高度
   * @returns {Number} 图像高度
   */
  getHeight() {
    return this.imageHeight;
  }

  /**
   * 检查图像是否为正方形
   * @returns {Boolean} 是否为正方形
   */
  isSquare() {
    return this.imageWidth === this.imageHeight;
  }

  /**
   * 获取图像尺寸
   * @returns {Object} 包含宽度和高度的对象
   */
  getImageSize() {
    return {
      width: this.imageWidth,
      height: this.imageHeight
    };
  }

  /**
   * 调整图像大小
   * @param {Number} width - 目标宽度
   * @param {Number} height - 目标高度（可选，默认等于宽度）
   * @param {Boolean} maintainAspectRatio - 是否保持宽高比
   * @returns {Object} 返回调整后的图像信息
   */
  resizeImage(width, height = width, maintainAspectRatio = false) {
    if (!this.image) {
      throw new Error('请先加载图像');
    }

    // 计算目标尺寸
    let targetWidth = width;
    let targetHeight = height;
    
    if (maintainAspectRatio) {
      const ratio = this.imageWidth / this.imageHeight;
      if (width / height > ratio) {
        targetWidth = height * ratio;
      } else {
        targetHeight = width / ratio;
      }
    }

    // 设置Canvas大小
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 清除画布
    this.ctx.clearRect(0, 0, width, height);
    
    // 如果需要保持宽高比，居中绘制
    if (maintainAspectRatio) {
      const offsetX = (width - targetWidth) / 2;
      const offsetY = (height - targetHeight) / 2;
      this.ctx.drawImage(this.image, offsetX, offsetY, targetWidth, targetHeight);
    } else {
      // 直接拉伸绘制
      this.ctx.drawImage(this.image, 0, 0, width, height);
    }
    
    // 返回图像数据
    const dataURL = this.canvas.toDataURL('image/png');
    return {
      dataURL,
      width,
      height
    };
  }

  /**
   * 生成指定大小的图标
   * @param {Number} size - 图标大小
   * @param {String} format - 输出格式（'png'|'jpeg'|'webp'）
   * @param {Number} quality - JPEG/WebP质量（0-1之间）
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>} 包含blob和dataURL的对象
   */
  generateIcon(size, format = 'png', quality = 0.9, options = {}) {
    if (!this.image) {
      throw new Error('请先加载图像');
    }
    
    // 设置Canvas大小
    this.canvas.width = size;
    this.canvas.height = size;
    
    // 清除画布
    this.ctx.clearRect(0, 0, size, size);
    
    // 绘制调整大小后的图像
    this.ctx.drawImage(this.image, 0, 0, size, size);
    
    // 确定MIME类型
    let mimeType;
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      case 'png':
      default:
        mimeType = 'image/png';
        break;
    }
    
    // 获取DataURL
    const dataURL = this.canvas.toDataURL(mimeType, quality);
    
    // 返回包含图像信息的对象
    return {
      dataURL,
      size,
      format,
      ...options
    };
  }

  /**
   * 批量生成多个尺寸的图标
   * @param {Array} sizes - 尺寸数组或尺寸对象数组
   * @param {String} format - 输出格式
   * @param {Number} quality - JPEG/WebP质量
   * @returns {Array} 图标信息数组
   */
  generateIcons(sizes, format = 'png', quality = 0.9) {
    const results = [];
    
    for (const sizeObj of sizes) {
      const size = typeof sizeObj === 'object' ? sizeObj.size : sizeObj;
      const options = typeof sizeObj === 'object' ? sizeObj : {};
      
      const iconData = this.generateIcon(size, format, quality, options);
      results.push(iconData);
    }
    
    return results;
  }

  /**
   * 为指定平台生成所有图标
   * @param {string} platform - 平台名称
   * @returns {Promise<Array>} 生成的图标数组
   */
  async generatePlatformIcons(platform) {
    const platformSizes = ICON_SIZES[platform];
    
    if (!platformSizes) {
      throw new Error(`不支持的平台: ${platform}`);
    }
    
    // 临时画布用于生成图标
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    const generatedIcons = await Promise.all(platformSizes.map(async iconConfig => {
      const { size, name, folder, ...metadata } = iconConfig;
      
      // 设置画布大小
      tempCanvas.width = size;
      tempCanvas.height = size;
      
      // 绘制调整大小的图像
      tempCtx.clearRect(0, 0, size, size);
      tempCtx.drawImage(this.image, 0, 0, size, size);
      
      // 转换为Blob
      const blob = await new Promise(resolve => {
        tempCanvas.toBlob(blob => resolve(blob), 'image/png');
      });
      
      // 获取DataURL
      const dataURL = tempCanvas.toDataURL('image/png');
      
      // 返回图标数据
      return {
        size,
        name,
        folder,
        blob,
        dataURL,
        ...metadata
      };
    }));
    
    return generatedIcons;
  }

  /**
   * 清理资源
   */
  dispose() {
    this.image = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.ctx = null;
    this.canvas = null;
  }
  
  /**
   * 重置图像处理器状态
   */
  reset() {
    this.image = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    // 保留canvas和ctx
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
} 