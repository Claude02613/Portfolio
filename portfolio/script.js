// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Command prompt animation configuration
    const cmdAnimationLines = [
        { text: "Microsoft Windows [Version 10.0.22631.4317]", type: "system", delay: 100 },
        { text: "(c) Microsoft Corporation. All rights reserved.", type: "system", delay: 100 },
        { text: "", type: "empty", delay: 100 },
        { text: "C:\\Users\\Claude_523>dir", type: "command", delay: 300 },
        { text: "Directory of C:\\Users\\Claude_523", type: "output", delay: 200 },
        { text: "", type: "empty", delay: 100 },
        { text: ">", type: "command", delay: 300 },
        { text: ">", type: "command", delay: 300 },
        { text: ">", type: "command", delay: 300 },
        { text: "NAME: Zhequan Zhang", type: "output", delay: 10 },
        { text: ">", type: "command", delay: 30 },
        { text: "ROLE: Digital Media Artist / Developer", type: "output", delay: 10 },
        { text: "Based in Melbourne", type: "output", delay: 10 },
        { text: "                     ", type: "empty", delay: 10 },
        { text: "C:\\Users\\Claude_523\\bio.text", type: "command", delay: 30 },
        { text: "                     ", type: "empty", delay: 10 },
        { text: "                     ", type: "empty", delay: 10 },
        { text: "A digital media artist and designer with a passion for bridging artistic expression and technical innovation, he specializes in creating immersive digital experiences through 3D modeling, animation, and interactive design. His bilingual background and appreciation for both Eastern and Western artistic traditions bring a unique cultural perspective to his work.", type: "command", delay: 30 },
        { text: "C:\\Users\\Claude_523\\bio.text", type: "command", delay: 30 },
        
    ];

    const logoWrapper = document.querySelector('.logo-wrapper');
    const tooltip = document.querySelector('.logo-tooltip');
    if (logoWrapper && tooltip) {
        logoWrapper.addEventListener('mousemove', (e) => {
            const rect = logoWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            tooltip.style.left = `${x + 15}px`;
            tooltip.style.top = `${y + 15}px`;
        });
    }


    // Core elements
    const projectTitles = document.querySelectorAll('.project-title');
    const projectBlocks = document.querySelectorAll('.project-block');
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');

    // Utility functions
    function getProjectId(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    // Project Navigation System
    class ProjectNavigation {
        constructor() {
            this.initializeProjects();
            this.setupScrollTracking();
            this.setupMobileMenu();
        }

        initializeProjects() {
            projectBlocks.forEach((block, index) => {
                const correspondingTitle = projectTitles[index];
                if (correspondingTitle) {
                    const titleText = correspondingTitle.textContent.trim();
                    block.id = getProjectId(titleText);
                    this.setupProjectInteractions(block);
                }
            });

            projectTitles.forEach(title => {
                title.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToProject(title);
                });
            });
        }

        setupProjectInteractions(block) {
            const image = block.querySelector('.project-image');
            if (image) {
                image.addEventListener('click', () => this.toggleProjectContent(block));
            }
        }

        navigateToProject(title) {
            const targetId = getProjectId(title.textContent.trim());
            const targetBlock = document.getElementById(targetId);
            
            if (targetBlock) {
                projectTitles.forEach(t => t.classList.remove('active'));
                title.classList.add('active');
                
                targetBlock.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });

                if (window.innerWidth <= 768) {
                    sidebar?.classList.remove('expanded');
                }
            }
        }

        toggleProjectContent(block) {
            const content = block.querySelector('.project-content');
            if (!content) return;

            projectBlocks.forEach(otherBlock => {
                if (otherBlock !== block) {
                    const otherContent = otherBlock.querySelector('.project-content');
                    if (otherContent) {
                        otherContent.classList.remove('expanded');
                    }
                }
            });

            content.classList.toggle('expanded');

            if (content.classList.contains('expanded')) {
                block.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                this.updateActiveTitle(block.id);
            }
        }

        setupScrollTracking() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.updateActiveTitle(entry.target.id);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-20% 0px -20% 0px'
            });

            projectBlocks.forEach(block => observer.observe(block));
        }

        updateActiveTitle(activeId) {
            projectTitles.forEach(title => {
                const titleId = getProjectId(title.textContent.trim());
                title.classList.toggle('active', titleId === activeId);
            });
        }

        setupMobileMenu() {
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    sidebar?.classList.toggle('expanded');
                });
            }
        }
    }

    // Floating Window Manager
    class FloatingWindow {
        constructor(windowId, config = {}) {
            this.window = document.getElementById(windowId);
            this.hasAnimation = config.hasAnimation || false;
            this.animationLines = config.animationLines || [];
            this.currentLineIndex = 0;
            this.isTyping = false;
            this.dragState = {
                isDragging: false,
                currentX: 0,
                currentY: 0,
                initialX: 0,
                initialY: 0
            };

            if (this.window) {
                this.setupWindow();
            }
        }

        setupWindow() {
            const closeBtn = this.window.querySelector('.cmd-close-btn');
            const titleBar = this.window.querySelector('.cmd-title-bar');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }

            if (titleBar) {
                this.setupDragging(titleBar);
            }
        }

        setupDragging(titleBar) {
            titleBar.addEventListener('mousedown', (e) => {
                this.dragState.isDragging = true;
                this.dragState.initialX = e.clientX - this.dragState.currentX;
                this.dragState.initialY = e.clientY - this.dragState.currentY;
                this.bringToFront();
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.dragState.isDragging) return;
                
                e.preventDefault();
                this.dragState.currentX = e.clientX - this.dragState.initialX;
                this.dragState.currentY = e.clientY - this.dragState.initialY;
                
                this.setPosition(this.dragState.currentX, this.dragState.currentY);
            });

            document.addEventListener('mouseup', () => {
                this.dragState.isDragging = false;
            });
        }

        setPosition(x, y) {
            this.window.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }

        show() {
            this.window.style.display = 'block';
            this.setPosition(0, 0);
            this.bringToFront();
            
            if (this.hasAnimation) {
                this.startAnimation();
            }
        }

        close() {
            this.window.style.display = 'none';
        }

        bringToFront() {
            this.window.style.zIndex = '1001';
        }

        startAnimation() {
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
    }

    // Initialize everything
    const projectNav = new ProjectNavigation();
    
    const cmdWindow = new FloatingWindow('cmdWindow', {
        hasAnimation: true,
        animationLines: cmdAnimationLines
    });
    
    const contactWindow = new FloatingWindow('contactWindow', {
        hasAnimation: false
    });

    const cvWindow = new FloatingWindow('cvWindow', {
        hasAnimation: false
    });

    // Setup window toggle functions
    window.toggleCmdWindow = function() {
        const win = document.getElementById('cmdWindow');
        const aboutBtn = document.querySelector('.about-link');
        
        if (win.style.display === 'none' || !win.style.display) {
            cmdWindow.show();
            aboutBtn?.classList.add('active');
        } else {
            cmdWindow.close();
            aboutBtn?.classList.remove('active');
        }
    };

    window.toggleContactWindow = function() {
        const win = document.getElementById('contactWindow');
        const contactBtn = document.querySelector('.contact-link');
        
        if (win.style.display === 'none' || !win.style.display) {
            contactWindow.show();
            contactBtn?.classList.add('active');
        } else {
            contactWindow.close();
            contactBtn?.classList.remove('active');
        }
    };

    window.toggleCVWindow = function() {
        const win = document.getElementById('cvWindow');
        if (win.style.display === 'none' || !win.style.display) {
            cvWindow.show();
        } else {
            cvWindow.close();
        }
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar?.classList.remove('expanded');
        }
    });
});