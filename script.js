document.addEventListener("DOMContentLoaded", () => {

    // Tech Canvas Background (Enhanced with glow, mouse ripple, more particles)
    function initTechBackground() {
        const canvas = document.getElementById('tech-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, particles;
        const particleCount = 150;
        const connectionDistance = 180;
        const mouse = { x: null, y: null, radius: 200 };

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
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.size = Math.random() * 2.5 + 0.5;
                this.density = (Math.random() * 30) + 1;
                this.color = Math.random() > 0.5 
                    ? `rgba(0, 242, 255, ${Math.random() * 0.5 + 0.3})` 
                    : `rgba(112, 0, 255, ${Math.random() * 0.4 + 0.2})`;
            }

            update() {
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
                        let dx2 = this.x - this.baseX;
                        this.x -= dx2 / 10;
                    }
                    if (this.y !== this.baseY) {
                        let dy2 = this.y - this.baseY;
                        this.y -= dy2 / 10;
                    }
                }

                this.baseX += this.vx;
                this.baseY += this.vy;
                if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
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

            // Draw mouse glow
            if (mouse.x && mouse.y) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
                gradient.addColorStop(0, 'rgba(0, 242, 255, 0.08)');
                gradient.addColorStop(0.5, 'rgba(112, 0, 255, 0.03)');
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }

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
                        const opacity = 1 - dist / connectionDistance;
                        ctx.strokeStyle = `rgba(0, 242, 255, ${opacity * 0.4})`;
                        ctx.lineWidth = opacity * 1.5;
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

    // Cursor Trail Effect
    function initCursorTrail() {
        const canvas = document.getElementById('cursor-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const trail = [];
        const maxTrailLength = 30;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, life: 1 });
            if (trail.length > maxTrailLength) trail.shift();
        });

        function animateTrail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < trail.length; i++) {
                const point = trail[i];
                point.life -= 0.025;

                if (point.life <= 0) {
                    trail.splice(i, 1);
                    i--;
                    continue;
                }

                const size = point.life * 4;
                const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size * 3);
                gradient.addColorStop(0, `rgba(0, 242, 255, ${point.life * 0.5})`);
                gradient.addColorStop(0.5, `rgba(112, 0, 255, ${point.life * 0.2})`);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }
    initCursorTrail();

    // Custom Cursor Logic (Enhanced with click pulse)
    function initCustomCursor() {
        const dot = document.querySelector('.cursor-dot');
        const outline = document.querySelector('.cursor-outline');
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Click effect — pulse
        window.addEventListener('mousedown', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(2)';
            dot.style.backgroundColor = '#7000ff';
            outline.style.borderColor = '#7000ff';
        });
        window.addEventListener('mouseup', () => {
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            dot.style.backgroundColor = '';
            outline.style.borderColor = '';
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-toggle, .cert-toggle, .project-card, .hover-lift, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hover'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hover'));
        });
    }
    initCustomCursor();

    // Navigation Bar Logic
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('nav-hamburger');
        const navLinks = document.querySelector('.nav-links');
        const links = document.querySelectorAll('.nav-link');

        // Scroll effect — add "scrolled" class
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Highlight active section
            const sections = document.querySelectorAll('section, header');
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Hamburger toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile menu on link click
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }
    initNavbar();

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
                const delay = (wordIndex * 5 + charIndex) * 0.1;
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
                
                const isHidden = targetContent.classList.contains("hidden");
                
                if (isHidden) {
                    targetContent.classList.remove("hidden");
                    btn.classList.add("active");
                } else {
                    targetContent.classList.add("hidden");
                    btn.classList.remove("active");
                }
                
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

    // Scroll Reveal Animation (Using Intersection Observer)
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
