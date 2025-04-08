// 等待文档加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 初始化所有功能
  initMobileMenu();
  initScrollAnimations();
  initParallaxEffect();
  initSmoothScroll();
  initFaqAccordion();
  initContactForm();
  initTypewriterEffect();
  initImagePreview();

  // 导航栏滚动效果
  const header = document.querySelector('header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });

  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // 添加动画效果
  const animatedElements = document.querySelectorAll('.animate');
  
  const checkIfInView = () => {
    const windowHeight = window.innerHeight;
    const windowTopPosition = window.scrollY;
    const windowBottomPosition = windowTopPosition + windowHeight;

    animatedElements.forEach(element => {
      const elementHeight = element.offsetHeight;
      const elementTopPosition = element.offsetTop;
      const elementBottomPosition = elementTopPosition + elementHeight;

      // 检查元素是否在视口中
      if (
        (elementBottomPosition >= windowTopPosition) &&
        (elementTopPosition <= windowBottomPosition)
      ) {
        element.classList.add('animated');
      }
    });
  };

  // 初次检查
  checkIfInView();
  
  // 滚动时检查
  window.addEventListener('scroll', checkIfInView);

  // 系统检测与下载链接
  const detectOS = () => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'macOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/Linux/.test(platform)) {
      os = 'Linux';
    }

    return os;
  };

  // 高亮推荐的下载选项
  const os = detectOS();
  if (os) {
    const recommendedCard = document.querySelector(`.download-card[data-os="${os}"]`);
    if (recommendedCard) {
      recommendedCard.classList.add('recommended');
      
      // 添加推荐标签
      const recommendedBadge = document.createElement('div');
      recommendedBadge.className = 'recommended-badge';
      recommendedBadge.textContent = '推荐';
      recommendedCard.appendChild(recommendedBadge);
    }
  }

  // 版本展示
  const version = '3.0.0'; // 当前版本
  document.querySelectorAll('.version-number').forEach(el => {
    el.textContent = version;
  });

  // 复制代码按钮
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', function() {
      const codeBlock = this.parentNode.querySelector('code');
      const textToCopy = codeBlock.textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // 临时改变按钮文本
        const originalText = this.textContent;
        this.textContent = '已复制!';
        
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('复制失败:', err);
      });
    });
  });

  // 移动端菜单
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
    
    // 点击菜单项后关闭菜单
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }
});

// 移动端菜单切换
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!menuToggle || !navMenu) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // 点击导航链接时关闭菜单
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// 滚动动画
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(element => {
    observer.observe(element);
    
    // 为每个元素添加延迟
    const delay = element.dataset.delay || 0;
    element.style.transitionDelay = `${delay}s`;
  });
}

// 视差效果
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 30;
      const moveX = (x - 0.5) * speed;
      const moveY = (y - 0.5) * speed;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
}

// 平滑滚动
function initSmoothScroll() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');
  
  scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    });
  });
}

// FAQ手风琴效果
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // 关闭其他所有项
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // 切换当前项
      item.classList.toggle('active', !isActive);
    });
  });
}

// 联系表单处理
function initContactForm() {
  const contactForm = document.querySelector('#contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // 简单验证
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(field => {
      const input = contactForm.querySelector(`[name="${field}"]`);
      const errorElement = contactForm.querySelector(`.error-${field}`);
      
      if (!formValues[field]) {
        isValid = false;
        input.classList.add('error');
        if (errorElement) errorElement.style.display = 'block';
      } else {
        input.classList.remove('error');
        if (errorElement) errorElement.style.display = 'none';
      }
    });
    
    if (!isValid) return;
    
    // 假设这里是发送表单数据的代码
    // 实际应用中应替换为真实的API调用
    console.log('表单已提交:', formValues);
    
    // 显示成功消息
    const successMessage = document.querySelector('.form-success');
    if (successMessage) {
      successMessage.style.display = 'block';
      contactForm.reset();
      
      // 5秒后隐藏成功消息
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    }
  });
}

// 打字机效果
function initTypewriterEffect() {
  const typeElements = document.querySelectorAll('.typewriter');
  
  typeElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    element.classList.add('typing');
    
    let charIndex = 0;
    const typingSpeed = 100; // 打字速度（毫秒/字符）
    
    function typeChar() {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typingSpeed);
      } else {
        element.classList.remove('typing');
      }
    }
    
    // 当元素进入视口时开始打字效果
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeChar, 500);
          observer.unobserve(element);
        }
      });
    });
    
    observer.observe(element);
  });
}

// 图片预览效果
function initImagePreview() {
  const previewLinks = document.querySelectorAll('.preview-link');
  const previewModal = document.querySelector('.preview-modal');
  
  if (!previewLinks.length || !previewModal) return;
  
  const previewImage = previewModal.querySelector('.preview-image');
  const closeButton = previewModal.querySelector('.close-preview');
  
  previewLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const imageSrc = link.getAttribute('href') || link.dataset.src;
      
      if (imageSrc && previewImage) {
        previewImage.src = imageSrc;
        previewModal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    });
  });
  
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      previewModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }
  
  // 点击模态框背景关闭
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      previewModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
  
  // ESC键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && previewModal.classList.contains('active')) {
      previewModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
}

// 处理下载按钮
document.querySelectorAll('.download-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const platform = this.dataset.platform;
    // 这里可以添加下载统计或其他操作
    console.log(`下载 ${platform} 版本`);
  });
});

// 简单的主题切换功能（如果需要）
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // 保存用户偏好
    const isDarkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkMode', isDarkMode);
  });
  
  // 初始化时检查用户偏好
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-theme', savedDarkMode);
}

// 监听页面离开
window.addEventListener('beforeunload', () => {
  // 可以在这里添加离开页面前的保存操作
});

// API示例部分的代码展示
const codeBlocks = document.querySelectorAll('.code-block');
codeBlocks.forEach(block => {
  const copyBtn = block.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code').textContent;
      navigator.clipboard.writeText(code)
        .then(() => {
          copyBtn.textContent = '已复制!';
          setTimeout(() => {
            copyBtn.textContent = '复制';
          }, 2000);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    });
  }
}); 