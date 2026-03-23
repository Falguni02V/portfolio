document.addEventListener("DOMContentLoaded", () => {

    // Tech Canvas Background (Digital Nodes/Network)
    function initTechBackground() {
        const canvas = document.getElementById('tech-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, particles;
        const particleCount = 100;
        const connectionDistance = 150;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
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
                        ctx.strokeStyle = `rgba(0, 242, 255, ${1 - dist / connectionDistance})`;
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
                // Calculate delay based on word and char index
                const delay = (wordIndex * 5 + charIndex) * 0.1;
                span.style.animationDelay = `${delay}s`;
                wordSpan.appendChild(span);
            });
            nameElement.appendChild(wordSpan);
        });
    }
    animateName();

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

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
