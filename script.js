document.addEventListener("DOMContentLoaded", () => {

    // Tech Canvas Background (Digital Nodes/Network)
    function initTechBackground() {
        const canvas = document.getElementById('tech-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, particles;
        const particleCount = 100;
        const connectionDistance = 150;
        const mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.density = (Math.random() * 30) + 1;
                this.char = ['<', '>', '{', '}', ';', '/', '()', '=>'][Math.floor(Math.random() * 8)];
            }

            update() {
                // Return to base position
                // this.x += this.vx;
                // this.y += this.vy;

                // Mouse interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }

                // Normal movement
                this.baseX += this.vx;
                this.baseY += this.vy;
                if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > height) this.vy *= -1;
            }

            draw() {
                const isLight = document.body.classList.contains('light-theme');
                if (isLight) {
                    ctx.fillStyle = `rgba(139, 92, 246, ${1 - this.size / 10})`;
                    ctx.font = `${this.size * 5 + 8}px monospace`;
                    ctx.fillText(this.char, this.x, this.y);
                } else {
                    ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const isLight = document.body.classList.contains('light-theme');
                        ctx.strokeStyle = isLight 
                            ? `rgba(139, 92, 246, ${0.4 - dist / (connectionDistance * 2.5)})` 
                            : `rgba(0, 242, 255, ${1 - dist / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        init();
        animate();
    }
    initTechBackground();

    // Theme Toggle Logic
    function initThemeToggle() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const body = document.body;
        const icon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

        if (!themeToggleBtn) return;

        // Check localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('tech-theme');
            if(icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else {
            // default to light
            if(icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                // Switch to Dark
                body.classList.remove('light-theme');
                body.classList.add('tech-theme');
                localStorage.setItem('theme', 'dark');
                if(icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            } else {
                // Switch to Light
                body.classList.remove('tech-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
                if(icon) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }
    initThemeToggle();

    // Splash Screen Logic
    function initSplashScreen() {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            setTimeout(() => {
                splash.classList.add('slide-out-up');
            }, 3000); // 3 seconds viewing time before continuing
        }
    }
    initSplashScreen();

    // Custom Cursor Logic
    function initCustomCursor() {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            // Delayed outline
            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-toggle, .cert-toggle, .project-card, .hover-lift');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });
    }
    initCustomCursor();

    // Scroll Progress Bar
    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }
    initScrollProgress();

    // Magnetic Elements
    function initMagneticElements() {
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // 3D Tilt Effect
    function initTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .timeline-item');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (centerY - y) / 10;
                const rotateY = (x - centerX) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            });
        });
    }
    initTiltEffect();
    initMagneticElements();

    // Name Letter-by-Letter Animation
    function animateName() {
        const nameElement = document.getElementById('animated-name');
        if (!nameElement) return;

        const text = nameElement.textContent;
        nameElement.textContent = '';
        nameElement.style.display = 'flex';
        nameElement.style.justifyContent = 'center';
        nameElement.style.flexWrap = 'wrap';

        const words = text.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.whiteSpace = 'nowrap';
            wordSpan.style.margin = '0 15px';

            [...word].forEach((char, charIndex) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'letter';
                // Calculate delay based on word and char index, accounting for splash and profile image animation
                const delay = 4.6 + (wordIndex * 5 + charIndex) * 0.1;
                span.style.animationDelay = `${delay}s`;
                wordSpan.appendChild(span);
            });
            nameElement.appendChild(wordSpan);
        });
    }
    animateName();

    // Text Scramble Effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply Scramble to section titles
    const scrambleElements = document.querySelectorAll('.section-title');
    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        const originalText = el.innerText;
        el.addEventListener('mouseenter', () => fx.setText(originalText));
    });

    // Helper function to manage independent toggles
    function setupButtonToggle(btnId, containerId, siblingContainerId = null) {
        const btn = document.getElementById(btnId);
        const container = document.getElementById(containerId);
        const siblingContainer = siblingContainerId ? document.getElementById(siblingContainerId) : null;

        if(btn && container) {
            btn.addEventListener("click", () => {
                const isHidden = container.classList.contains("hidden");
                
                if (isHidden) {
                    container.classList.remove("hidden");
                } else {
                    container.classList.add("hidden");
                }

                // Close sibling if opening this one
                if (siblingContainer && !siblingContainer.classList.contains("hidden") && isHidden) {
                    siblingContainer.classList.add("hidden");
                }
            });
        }
    }

    // Hero Section Toggles (Resume & Hire Me)
    setupButtonToggle("resume-toggle", "resume-container", "hire-container");
    setupButtonToggle("hire-toggle", "hire-container", "resume-container");

    // Generic function for toggling accordions
    function setupAccordions(toggleSelector) {
        const toggles = document.querySelectorAll(toggleSelector);
        toggles.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetId = btn.getAttribute("data-target");
                const targetContent = document.getElementById(targetId);
                
                // Toggle current
                const isHidden = targetContent.classList.contains("hidden");
                
                if (isHidden) {
                    targetContent.classList.remove("hidden");
                    btn.classList.add("active");
                } else {
                    targetContent.classList.add("hidden");
                    btn.classList.remove("active");
                }
                
                // Close others in same group
                toggles.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.classList.remove("active");
                        const otherTargetId = otherBtn.getAttribute("data-target");
                        const otherTarget = document.getElementById(otherTargetId);
                        if (otherTarget && !otherTarget.classList.contains("hidden")) {
                            otherTarget.classList.add("hidden");
                        }
                    }
                });
            });
        });
    }

    // Initialize toggles for skills and certs
    setupAccordions(".skill-toggle");
    setupAccordions(".cert-toggle");

    // Scroll Reveal Animation (Using Intersection Observer for better performance)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-blur, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    // Contact Form submission override format for mailto
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            const name = document.getElementById("senderName").value;
            const phone = document.getElementById("senderPhone").value;
            const email = document.getElementById("senderEmail").value;
            const message = document.getElementById("senderMessage").value;
            
            const bodyText = `Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            contactForm.setAttribute("action", `mailto:vashishthafalguni@gmail.com?subject=Portfolio Contact from ${name}&body=${bodyText}`);
        });
    }
});
