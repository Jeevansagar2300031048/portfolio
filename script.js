// ==================== 3D Perspective Cyberpunk Grid ====================
const canvas = document.createElement('canvas');
canvas.id = 'grid-canvas';
document.body.insertBefore(canvas, document.body.firstChild);

const ctx = canvas.getContext('2d');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let time = 0;

// Floating particles
const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2 + 1;
        this.speedZ = Math.random() * 2 + 0.5;
        this.color = Math.random() > 0.7 ? 'magenta' : 'cyan';
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.z -= this.speedZ;
        this.pulse += 0.05;
        if (this.z <= 0) this.reset();
    }
    
    draw() {
        const scale = 500 / (this.z + 500);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = this.size * scale * (1 + Math.sin(this.pulse) * 0.3);
        const alpha = Math.min(1, scale * 1.5);
        
        // Glow
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 8);
        if (this.color === 'cyan') {
            gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha * 0.8})`);
            gradient.addColorStop(0.3, `rgba(0, 200, 255, ${alpha * 0.3})`);
        } else {
            gradient.addColorStop(0, `rgba(255, 0, 170, ${alpha * 0.8})`);
            gradient.addColorStop(0.3, `rgba(200, 0, 255, ${alpha * 0.3})`);
        }
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = this.color === 'cyan' ? `rgba(200, 255, 255, ${alpha})` : `rgba(255, 200, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawLine(x1, y1, x2, y2, color, width, glow = true) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
    }
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
}

function draw3DGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dark gradient background
    const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.4, 0,
        canvas.width / 2, canvas.height * 0.4, canvas.width
    );
    bgGradient.addColorStop(0, '#0a1525');
    bgGradient.addColorStop(0.5, '#030a15');
    bgGradient.addColorStop(1, '#000510');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid parameters
    const horizon = canvas.height * 0.35;
    const gridLines = 30;
    const perspectiveStrength = 2.5;
    const gridSpacing = 80;
    
    // Calculate mouse influence for spotlight
    const spotlightX = mouseX;
    const spotlightY = mouseY;
    
    // Draw horizontal lines (going into distance)
    for (let i = 0; i <= gridLines; i++) {
        const progress = i / gridLines;
        const y = horizon + Math.pow(progress, perspectiveStrength) * (canvas.height - horizon);
        const alpha = 0.1 + progress * 0.5;
        const lineWidth = 0.5 + progress * 1.5;
        
        // Distance from mouse for glow effect
        const distY = Math.abs(y - spotlightY);
        const glowIntensity = Math.max(0, 1 - distY / 200);
        const finalAlpha = alpha + glowIntensity * 0.4;
        
        // Main cyan line
        drawLine(0, y, canvas.width, y, `rgba(0, 220, 255, ${finalAlpha})`, lineWidth);
        
        // Magenta accent at random intervals
        if (i % 5 === 0) {
            drawLine(0, y, canvas.width, y, `rgba(255, 0, 170, ${finalAlpha * 0.3})`, lineWidth + 2);
        }
    }
    
    // Draw vertical lines (perspective converging to center)
    const centerX = canvas.width / 2;
    const verticalLines = 40;
    
    for (let i = -verticalLines / 2; i <= verticalLines / 2; i++) {
        const bottomX = centerX + i * gridSpacing;
        const topX = centerX + i * gridSpacing * 0.1;
        
        // Distance from mouse
        const distX = Math.abs(bottomX - spotlightX);
        const glowIntensity = Math.max(0, 1 - distX / 150);
        const alpha = 0.15 + glowIntensity * 0.5;
        const lineWidth = 0.5 + glowIntensity * 1.5;
        
        // Main line
        drawLine(topX, horizon, bottomX, canvas.height, `rgba(0, 220, 255, ${alpha})`, lineWidth);
        
        // Magenta accents
        if (Math.abs(i) % 4 === 0) {
            drawLine(topX, horizon, bottomX, canvas.height, `rgba(255, 0, 170, ${alpha * 0.4})`, lineWidth + 1);
        }
    }
    
    // Draw glowing nodes at intersections near cursor
    for (let row = 0; row <= gridLines; row++) {
        const progress = row / gridLines;
        const y = horizon + Math.pow(progress, perspectiveStrength) * (canvas.height - horizon);
        const scale = progress;
        
        for (let col = -verticalLines / 2; col <= verticalLines / 2; col++) {
            const x = centerX + col * gridSpacing * scale + (col * gridSpacing * 0.1 * (1 - scale));
            
            const dx = x - spotlightX;
            const dy = y - spotlightY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const intensity = Math.max(0, 1 - dist / 250);
            
            if (intensity > 0.1) {
                const nodeSize = 2 + intensity * 6;
                const pulseScale = 1 + Math.sin(time * 3 + row + col) * 0.2;
                
                // Node glow
                const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 5 * pulseScale);
                gradient.addColorStop(0, `rgba(0, 255, 255, ${intensity * 0.9})`);
                gradient.addColorStop(0.3, `rgba(100, 200, 255, ${intensity * 0.4})`);
                gradient.addColorStop(0.6, `rgba(200, 0, 255, ${intensity * 0.15})`);
                gradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, nodeSize * 5 * pulseScale, 0, Math.PI * 2);
                ctx.fill();
                
                // Bright core
                ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
                ctx.beginPath();
                ctx.arc(x, y, nodeSize * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Update and draw floating particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    // Cursor spotlight overlay
    const spotGradient = ctx.createRadialGradient(spotlightX, spotlightY, 0, spotlightX, spotlightY, 400);
    spotGradient.addColorStop(0, 'rgba(0, 255, 255, 0.08)');
    spotGradient.addColorStop(0.3, 'rgba(138, 43, 226, 0.04)');
    spotGradient.addColorStop(0.6, 'rgba(255, 0, 170, 0.02)');
    spotGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = spotGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    time += 0.016;
    requestAnimationFrame(draw3DGrid);
}

draw3DGrid();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;
});

// ==================== Navigation Toggle ====================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ==================== Active Navigation Link ====================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ==================== Navbar Background on Scroll ====================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ==================== Scroll Reveal Animation ====================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to animate
const animateElements = document.querySelectorAll(
    '.skill-category, .project-card, .contact-card, .about-content, .section-title'
);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add CSS for revealed state
const style = document.createElement('style');
style.textContent = `
    .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ==================== Contact Form Handling ====================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // You can integrate this with your email service (e.g., EmailJS, Formspree)
    console.log('Form submitted:', data);
    
    // Show success message
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = '#10b981';
    
    // Reset form
    contactForm.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 3000);
});

// ==================== Typing Effect for Hero ====================
const heroSubtitle = document.querySelector('.hero-subtitle');
const roles = ['AI Developer', 'Web Developer', 'Software Engineer', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeRole() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        heroSubtitle.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        heroSubtitle.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentRole.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeRole, typingSpeed);
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(typeRole, 1500);
});

// ==================== Smooth Scroll for Anchor Links ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Project Card Hover Effect ====================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==================== Skill Tags Animation ====================
const skillTags = document.querySelectorAll('.skill-tag');

skillTags.forEach((tag, index) => {
    tag.style.animationDelay = `${index * 0.1}s`;
});

// ==================== Back to Top Button (Optional) ====================
const createBackToTop = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-5px)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
    });
};

createBackToTop();

// ==================== Console Easter Egg ====================
console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out my GitHub!', 'font-size: 14px;');

// ==================== Electric Circuit CPU System ====================
class CircuitSystem {
    constructor() {
        this.circuitOverlay = document.getElementById('circuitOverlay');
        this.circuitPaths = document.getElementById('circuitPaths');
        this.pulsePaths = document.getElementById('pulsePaths');
        this.cpuHub = document.getElementById('cpuHub');
        this.contentContainer = document.getElementById('circuitContentContainer');
        this.navLinksCircuit = document.querySelectorAll('.nav-link:not(.resume-btn)');
        
        this.activeContent = null;
        this.isAnimating = false;
        this.paths = {};
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        this.createCircuitPaths();
        this.bindEvents();
        window.addEventListener('resize', () => this.createCircuitPaths());
    }
    
    // Generate SVG path from nav link to CPU center
    createCircuitPaths() {
        this.circuitPaths.innerHTML = '';
        this.pulsePaths.innerHTML = '';
        
        const cpuX = window.innerWidth / 2;
        const cpuY = window.innerHeight / 2;
        
        this.navLinksCircuit.forEach((link, index) => {
            const rect = link.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.bottom + 15;
            
            // Create PCB-style path with right angles
            const pathData = this.generatePCBPath(startX, startY, cpuX, cpuY, index);
            
            // Background circuit path (always visible faintly)
            const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            bgPath.setAttribute('d', pathData);
            bgPath.setAttribute('class', 'circuit-path-glow');
            this.circuitPaths.appendChild(bgPath);
            
            const circuitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            circuitPath.setAttribute('d', pathData);
            circuitPath.setAttribute('class', 'circuit-path');
            this.circuitPaths.appendChild(circuitPath);
            
            // Pulse path (for animation)
            const pulsePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pulsePath.setAttribute('d', pathData);
            pulsePath.setAttribute('class', 'pulse-path');
            pulsePath.id = `pulse-${link.getAttribute('href').substring(1)}`;
            this.pulsePaths.appendChild(pulsePath);
            
            // Store path length for animation
            const pathLength = pulsePath.getTotalLength();
            pulsePath.style.strokeDasharray = `50 ${pathLength}`;
            pulsePath.style.strokeDashoffset = pathLength;
            
            this.paths[link.getAttribute('href').substring(1)] = {
                element: pulsePath,
                length: pathLength
            };
            
            // Add circuit node at start point
            this.addCircuitNode(startX, startY);
        });
        
        // Add nodes along paths for visual effect
        this.addIntermediateNodes();
    }
    
    generatePCBPath(startX, startY, endX, endY, index) {
        // Create different PCB-style paths based on position
        const midY1 = startY + 60 + (index * 20);
        const midY2 = endY - 80 + (index * 15);
        
        // Different routing strategies based on position
        if (startX < endX - 100) {
            // Link is to the left of CPU
            const midX = startX + (endX - startX) * 0.3;
            return `M ${startX} ${startY} 
                    L ${startX} ${midY1} 
                    L ${midX} ${midY1} 
                    L ${midX} ${midY2} 
                    L ${endX - 40} ${midY2} 
                    L ${endX - 40} ${endY}
                    L ${endX} ${endY}`;
        } else if (startX > endX + 100) {
            // Link is to the right of CPU
            const midX = startX - (startX - endX) * 0.3;
            return `M ${startX} ${startY} 
                    L ${startX} ${midY1} 
                    L ${midX} ${midY1} 
                    L ${midX} ${midY2} 
                    L ${endX + 40} ${midY2} 
                    L ${endX + 40} ${endY}
                    L ${endX} ${endY}`;
        } else {
            // Link is roughly centered
            const offsetX = (index - 2) * 50;
            return `M ${startX} ${startY} 
                    L ${startX} ${midY1} 
                    L ${startX + offsetX} ${midY1} 
                    L ${startX + offsetX} ${midY2} 
                    L ${endX} ${midY2}
                    L ${endX} ${endY}`;
        }
    }
    
    addCircuitNode(x, y) {
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', x);
        node.setAttribute('cy', y);
        node.setAttribute('r', '4');
        node.setAttribute('fill', 'rgba(0, 210, 255, 0.5)');
        node.setAttribute('class', 'circuit-node');
        this.circuitPaths.appendChild(node);
    }
    
    addIntermediateNodes() {
        // Add small decorative nodes at path intersections
        const cpuX = window.innerWidth / 2;
        const cpuY = window.innerHeight / 2;
        
        // Nodes around CPU
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            const x = cpuX + Math.cos(rad) * 70;
            const y = cpuY + Math.sin(rad) * 70;
            this.addCircuitNode(x, y);
        });
    }
    
    bindEvents() {
        this.navLinksCircuit.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                this.triggerCircuit(link, sectionId);
            });
        });
        
        // Close content on click
        document.querySelectorAll('.close-content').forEach(btn => {
            btn.addEventListener('click', () => this.powerDown());
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeContent) {
                this.powerDown();
            }
        });
    }
    
    async triggerCircuit(link, sectionId) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // If there's already active content, power it down first
        if (this.activeContent) {
            await this.powerDown();
        }
        
        // Mark link as active
        this.navLinksCircuit.forEach(l => l.classList.remove('circuit-active'));
        link.classList.add('circuit-active');
        
        // Get path info
        const pathInfo = this.paths[sectionId];
        if (!pathInfo) {
            this.isAnimating = false;
            return;
        }
        
        // Show and scale in CPU
        this.cpuHub.classList.add('active');
        
        const cpuTimeline = gsap.timeline();
        
        // Animate CPU appearing
        cpuTimeline.to(this.cpuHub, {
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });
        
        // Animate pulse along path
        const pulseElement = pathInfo.element;
        pulseElement.style.opacity = '1';
        
        // Electric pulse animation
        gsap.fromTo(pulseElement, 
            { strokeDashoffset: pathInfo.length },
            {
                strokeDashoffset: -50,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Power on flash
                    this.cpuHub.classList.add('flash', 'powered');
                    
                    setTimeout(() => {
                        this.cpuHub.classList.remove('flash');
                        this.revealContent(sectionId);
                    }, 300);
                    
                    // Fade out pulse
                    gsap.to(pulseElement, {
                        opacity: 0,
                        duration: 0.3,
                        delay: 0.2
                    });
                }
            }
        );
    }
    
    revealContent(sectionId) {
        const content = document.querySelector(`.circuit-content[data-section="${sectionId}"]`);
        if (!content) {
            this.isAnimating = false;
            return;
        }
        
        this.activeContent = content;
        content.classList.add('active');
        
        // Content reveal animation with clip-path
        const timeline = gsap.timeline({
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        // Expand from center
        timeline.to(content, {
            width: 'auto',
            height: 'auto',
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out'
        });
        
        // Fade in inner content
        timeline.to(content.querySelector('.content-inner'), {
            opacity: 1,
            duration: 0.3
        }, '-=0.2');
    }
    
    powerDown() {
        return new Promise((resolve) => {
            if (!this.activeContent) {
                this.isAnimating = false;
                resolve();
                return;
            }
            
            const content = this.activeContent;
            content.classList.add('power-down');
            
            // Fade out content inner first
            gsap.to(content.querySelector('.content-inner'), {
                opacity: 0,
                duration: 0.2
            });
            
            // Then collapse
            gsap.to(content, {
                width: 0,
                height: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                delay: 0.2,
                onComplete: () => {
                    content.classList.remove('active', 'power-down');
                    
                    // Hide CPU
                    this.cpuHub.classList.remove('powered');
                    gsap.to(this.cpuHub, {
                        scale: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            this.cpuHub.classList.remove('active');
                            this.navLinksCircuit.forEach(l => l.classList.remove('circuit-active'));
                            this.activeContent = null;
                            this.isAnimating = false;
                            resolve();
                        }
                    });
                }
            });
        });
    }
}

// Initialize circuit system after page loads
window.addEventListener('load', () => {
    // Small delay to ensure all elements are positioned
    setTimeout(() => {
        if (window.innerWidth > 768) {
            new CircuitSystem();
        }
    }, 500);
});
