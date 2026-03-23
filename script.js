document.addEventListener("DOMContentLoaded", () => {

    // Starry Background Implementation
    function createStars() {
        const starContainer = document.createElement('div');
        starContainer.className = 'stars-container';
        document.body.appendChild(starContainer);

        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.animationDuration = `${Math.random() * 4 + 1.5}s`;
            star.style.animationDelay = `${Math.random() * 4}s`;
            // Random sizes for depth
            const size = Math.random() * 2.5;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            starContainer.appendChild(star);
        }
    }
    createStars();

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

    // Scroll Reveal Animation Functionality
    const reveals = document.querySelectorAll(".reveal");

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Trigger distance from bottom of screen

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add("active");
            }
        });
    }

    // Bind scroll event
    window.addEventListener("scroll", reveal);
    
    // Trigger on load in case elements are already in view
    setTimeout(reveal, 100);

    // Contact Form submission override format for mailto
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            const name = document.getElementById("senderName").value;
            const phone = document.getElementById("senderPhone").value;
            const email = document.getElementById("senderEmail").value;
            const message = document.getElementById("senderMessage").value;
            
            // Constructing basic URL encoded format
            const bodyText = `Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
            contactForm.setAttribute("action", `mailto:vashishthafalguni@gmail.com?subject=Portfolio Contact from ${name}&body=${bodyText}`);
            // Let the form submit natively via action change
        });
    }
});
