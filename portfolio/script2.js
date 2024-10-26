document.addEventListener('DOMContentLoaded', () => {
    // Helper function to get project ID from title
    function getProjectId(title) {
        return title.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    // Set up project title click handlers
    const originalContent = document.querySelector('.scroll-content');
    const duplicateContent = document.querySelector('.scroll-content-duplicate');

    const projectTitles = document.querySelectorAll('.project-title');
    const projectBlocks = document.querySelectorAll('.project-block');

    if (originalContent && duplicateContent) {
        // 复制内容
        duplicateContent.innerHTML = originalContent.innerHTML;
        
        // 计算内容总高度并调整动画
        const contentHeight = originalContent.offsetHeight;
        const container = document.querySelector('.scroll-container');
        
        if (container) {
            const containerHeight = container.offsetHeight;
            const duration = Math.max(20, contentHeight / 50); // 根据内容高度调整动画时长
            
            // 应用动画
            originalContent.style.animation = `smoothScroll ${duration}s linear infinite`;
            duplicateContent.style.animation = `smoothScroll ${duration}s linear infinite`;
            duplicateContent.style.animationDelay = `-${duration / 2}s`;
        }
    }

    // 添加滚动监听
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 找到对应的菜单项并高亮
                projectTitles.forEach(title => {
                    const titleId = getProjectId(title.textContent);
                    if (titleId === entry.target.id) {
                        // 移除所有其他高亮
                        projectTitles.forEach(t => t.classList.remove('active'));
                        // 添加当前高亮
                        title.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5, // 当项目显示50%时触发
        rootMargin: '-10% 0px -10% 0px' // 添加一些边距以提升体验
    });

    // 观察所有项目块
    projectBlocks.forEach(block => {
        observer.observe(block);
    });

    // 点击标题时的处理
    projectTitles.forEach(title => {
        title.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 获取对应的项目块
            const projectId = getProjectId(title.textContent);
            const projectBlock = document.getElementById(projectId);
            
            if (projectBlock) {
                // 滚动到项目
                projectBlock.scrollIntoView({ behavior: 'smooth' });
                
                // 高亮当前标题
                projectTitles.forEach(t => t.classList.remove('active'));
                title.classList.add('active');
            }
        });
    });

    // 点击项目图片时的处理
    projectBlocks.forEach(block => {
        const image = block.querySelector('.project-image');
        if (image) {
            image.addEventListener('click', () => {
                const content = block.querySelector('.project-content');
                if (content) {
                    // 切换展开状态
                    content.classList.toggle('expanded');
                    
                    // 高亮对应的菜单项
                    const blockId = block.id;
                    projectTitles.forEach(title => {
                        const titleId = getProjectId(title.textContent);
                        title.classList.toggle('active', titleId === blockId);
                    });

                    // 如果展开，滚动到项目位置
                    if (content.classList.contains('expanded')) {
                        block.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start'
                        });
                    }
                }
            });
        }
    });


/* ----------------------------------------------------------- */

class ProjectHandler {
    constructor() {
        this.projectBlocks = document.querySelectorAll('.project-block');
        this.projectTitles = document.querySelectorAll('.project-title');
        this.init();
    }

    init() {
        this.projectBlocks.forEach(block => {
            const image = block.querySelector('.project-image');
            const expandButton = document.createElement('button');
            expandButton.className = 'expand-button';
            expandButton.innerHTML = `
                <span class="expand-icon">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                </span>
            `;
            
            // Insert button after image
            image.parentNode.insertBefore(expandButton, image.nextSibling);

            // Click handler for expand button
            expandButton.addEventListener('click', () => {
                const content = block.querySelector('.project-content');
                const isExpanded = content.classList.contains('expanded');
                
                // Close all other expanded content first
                this.closeAllExcept(block);

                // Toggle current content
                content.classList.toggle('expanded');
                expandButton.classList.toggle('expanded');

                // Scroll into view if expanding
                if (!isExpanded) {
                    block.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start'
                    });
                }

                // Update sidebar navigation
                this.updateSidebar(block.id);
            });
        });

        // Implement scroll spy for navigation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateSidebar(entry.target.id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -20% 0px'
        });

        this.projectBlocks.forEach(block => observer.observe(block));
    }

    closeAllExcept(currentBlock) {
        this.projectBlocks.forEach(block => {
            if (block !== currentBlock) {
                const content = block.querySelector('.project-content');
                const expandButton = block.querySelector('.expand-button');
                if (content) {
                    content.classList.remove('expanded');
                }
                if (expandButton) {
                    expandButton.classList.remove('expanded');
                }
            }
        });
    }

    updateSidebar(projectId) {
        this.projectTitles.forEach(title => {
            const titleId = title.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            title.classList.toggle('active', titleId === projectId);
        });
    }
}

// Initialize the project handler
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ProjectHandler
    const projectHandler = new ProjectHandler();
    
    // Initialize window instances
    const cmdWindow = new FloatingWindow('cmdWindow', {
        hasAnimation: true,
        animationLines: cmdAnimationLines // Make sure this is defined above
    });
    
    const contactWindow = new FloatingWindow('contactWindow', {
        hasAnimation: false
    });

    // Set up toggle functions
    window.toggleCmdWindow = function() {
        const win = document.getElementById('cmdWindow');
        const aboutBtn = document.querySelector('.about-link');
        
        if (win.style.display === 'none' || !win.style.display) {
            cmdWindow.show();
            aboutBtn.classList.add('active');
        } else {
            cmdWindow.close();
            aboutBtn.classList.remove('active');
        }
    };

    window.toggleContactWindow = function() {
        const win = document.getElementById('contactWindow');
        const contactBtn = document.querySelector('.contact-link');
        
        if (win.style.display === 'none' || !win.style.display) {
            contactWindow.show();
            contactBtn.classList.add('active');
        } else {
            contactWindow.close();
            contactBtn.classList.remove('active');
        }
    };

    // Handle window focus
    document.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.cmd-window');
        if (clickedWindow) {
            const windowInstance = clickedWindow.id === 'cmdWindow' ? cmdWindow : contactWindow;
            windowInstance.bringToFront();
        }
    });

    // Handle resize events for mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.remove('expanded');
            }
        }
    });
});





    // Window manager class with animation support
    class FloatingWindow {
        constructor(windowId, config = {}) {
            this.window = document.getElementById(windowId);
            this.isDragging = false;
            this.currentX = 0;
            this.currentY = 0;
            this.initialX = 0;
            this.initialY = 0;
            this.xOffset = 0;
            this.yOffset = 0;
            this.isTyping = false;
            this.currentLineIndex = 0;
            
            // Animation configuration
            this.hasAnimation = config.hasAnimation || false;
            this.animationLines = config.animationLines || [];
            
            this.init();
        }

        init() {
            const titleBar = this.window.querySelector('.cmd-title-bar');
            const closeButton = this.window.querySelector('.cmd-close-btn');

            titleBar.addEventListener('mousedown', (e) => this.dragStart(e));
            document.addEventListener('mousemove', (e) => this.drag(e));
            document.addEventListener('mouseup', () => this.dragEnd());

            if (closeButton) {
                closeButton.addEventListener('click', () => this.close());
            }

            window.addEventListener('resize', () => this.keepInViewport());
            this.window.style.zIndex = '1000';
        }

        dragStart(e) {
            if (e.target.closest('.cmd-title-bar')) {
                this.initialX = e.clientX - this.xOffset;
                this.initialY = e.clientY - this.yOffset;
                this.isDragging = true;
                this.bringToFront();
            }
        }

        drag(e) {
            if (this.isDragging) {
                e.preventDefault();
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
                this.xOffset = this.currentX;
                this.yOffset = this.currentY;
                this.setTranslate(this.currentX, this.currentY);
            }
        }

        dragEnd() {
            this.isDragging = false;
            this.keepInViewport();
        }

        setTranslate(xPos, yPos) {
            this.window.style.transform = `translate(calc(-50% + ${xPos}px), calc(-50% + ${yPos}px))`;
        }

        keepInViewport() {
            const rect = this.window.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (rect.right > viewportWidth) {
                this.xOffset -= (rect.right - viewportWidth + 10);
            }
            if (rect.left < 0) {
                this.xOffset -= rect.left - 10;
            }
            if (rect.bottom > viewportHeight) {
                this.yOffset -= (rect.bottom - viewportHeight + 10);
            }
            if (rect.top < 0) {
                this.yOffset -= rect.top - 10;
            }

            this.setTranslate(this.xOffset, this.yOffset);
        }

        bringToFront() {
            const allWindows = document.querySelectorAll('.cmd-window');
            allWindows.forEach(win => win.style.zIndex = '1000');
            this.window.style.zIndex = '1001';
        }

        resetPosition() {
            this.xOffset = 0;
            this.yOffset = 0;
            this.setTranslate(0, 0);
        }

        startAnimation() {
            if (!this.hasAnimation) return;
            
            const cmdText = this.window.querySelector('.cmd-text');
            if (!cmdText) return;
            
            cmdText.innerHTML = '';
            this.currentLineIndex = 0;
            this.isTyping = false;
            this.typeNextLine(cmdText);
        }

        typeNextLine(cmdText) {
            if (this.currentLineIndex >= this.animationLines.length || this.isTyping) return;
            
            const line = this.animationLines[this.currentLineIndex];
            this.isTyping = true;
            
            const lineElement = document.createElement('div');
            lineElement.className = `cmd-line ${line.type}-line`;
            cmdText.appendChild(lineElement);
            
            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < line.text.length) {
                    lineElement.textContent = line.text.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeChar, Math.random() * 20 + 10);
                } else {
                    this.isTyping = false;
                    this.currentLineIndex++;
                    
                    if (this.currentLineIndex < this.animationLines.length) {
                        setTimeout(() => this.typeNextLine(cmdText), line.delay);
                    } else {
                        lineElement.classList.add('typing-complete');
                    }
                }
            };
            
            typeChar();
        }

        show() {
            this.window.style.display = 'block';
            this.resetPosition();
            this.bringToFront();
            if (this.hasAnimation) {
                this.startAnimation();
            }
        }

        close() {
            this.window.style.display = 'none';
        }
    }

    // Command prompt animation configuration
    const cmdAnimationLines = [
        { text: "Microsoft Windows [Version 10.0.22631.4317]", type: "system", delay: 100 },
        { text: "(c) Microsoft Corporation. All rights reserved.", type: "system", delay: 100 },
        { text: "", type: "empty", delay: 100 },
        { text: "C:\\Users\\Claude_523>dir", type: "command", delay: 300 },
        { text: "Directory of C:\\Users\\Claude_523", type: "output", delay: 200 },
        { text: "", type: "empty", delay: 100 },
        { text: "C:\\Users\\Claude_523>type bio.txt", type: "command", delay: 300 },
        { text: "NAME: Claude", type: "output", delay: 100 },
        { text: "ROLE: Digital Media Artist / Developer", type: "output", delay: 100 },
        { text: "LOCATION: Melbourne, Australia", type: "output", delay: 100 },
        { text: "", type: "empty", delay: 100 },
        { text: "C:\\Users\\Claude_523>", type: "command", delay: 300 }
    ];

    // Create window instances
    const cmdWindow = new FloatingWindow('cmdWindow', {
        hasAnimation: true,
        animationLines: cmdAnimationLines
    });
    
    const contactWindow = new FloatingWindow('contactWindow', {
        hasAnimation: false
    });

    // Set up toggle functions
    window.toggleCmdWindow = function() {
        const win = document.getElementById('cmdWindow');
        if (win.style.display === 'none' || !win.style.display) {
            cmdWindow.show();
        } else {
            cmdWindow.close();
        }
    };

    window.toggleContactWindow = function() {
        const win = document.getElementById('contactWindow');
        if (win.style.display === 'none' || !win.style.display) {
            contactWindow.show();
        } else {
            contactWindow.close();
        }
    };

    // Handle window focus
    document.addEventListener('mousedown', (e) => {
        const clickedWindow = e.target.closest('.cmd-window');
        if (clickedWindow) {
            const windowInstance = clickedWindow.id === 'cmdWindow' ? cmdWindow : contactWindow;
            windowInstance.bringToFront();
        }
    });

    // Handle resize events for mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('expanded');
        }
    });
});