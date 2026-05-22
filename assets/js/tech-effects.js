// Tech Effects for Yuxiang MA's Homepage
// Particle Constellation + Matrix Rain + Typing + Dark Mode
(function() {
    'use strict';

    // ============================================
    // Dark Mode — default light, manual toggle only
    // ============================================
    function initDarkMode() {
        const saved = localStorage.getItem('dark-mode');

        // Only apply dark if user explicitly chose it
        if (saved === 'dark') {
            document.body.classList.add('dark-mode');
        }

        // Create toggle button
        const btn = document.createElement('button');
        btn.className = 'dark-mode-toggle';
        btn.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        btn.title = 'Toggle dark mode';
        btn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            btn.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('dark-mode', isDark ? 'dark' : 'light');
        });
        document.body.appendChild(btn);
    }

    initDarkMode();

    // ============================================
    // Particle Constellation
    // ============================================
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    document.body.prepend(particleCanvas);
    const pCtx = particleCanvas.getContext('2d');
    let particles = [];

    function resizePCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizePCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.25 + 0.08;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
            pCtx.fill();
        }
    }

    function initParticles() {
        const n = Math.min(50, Math.floor((particleCanvas.width * particleCanvas.height) / 25000));
        particles = Array.from({length: n}, () => new Particle());
    }

    function drawConnections() {
        const maxD = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxD) {
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(0, 180, 216, ${(1 - d / maxD) * 0.1})`;
                    pCtx.lineWidth = 0.5;
                    pCtx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // ============================================
    // Matrix Rain
    // ============================================
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.id = 'matrix-canvas';
    document.body.prepend(matrixCanvas);
    const mCtx = matrixCanvas.getContext('2d');

    function resizeMCanvas() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
    resizeMCanvas();

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*(){}[]<>?/~';
    const fontSize = 14;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(13, 17, 23, 0.06)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        mCtx.font = fontSize + 'px JetBrains Mono, monospace';
        for (let i = 0; i < drops.length; i++) {
            const ch = chars[Math.floor(Math.random() * chars.length)];
            mCtx.fillStyle = `rgba(0, 180, 216, ${Math.random() * 0.25 + 0.08})`;
            mCtx.fillText(ch, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 65);

    // ============================================
    // Typing Effect — Sidebar (all pages)
    // ============================================
    const myPhrases = [
        'Cybersecurity',
        'Trustworthy AI',
        'Embodied AI',
        'Mobile Computing',
        'Intelligent Networked Systems'
    ];

    const henuPhrases = [
        'One of the oldest universities in China'
    ];

    function initTyping() {
        const el = document.getElementById('sidebar-typing-text');
        if (!el) return;

        // Detect HENU page
        const isHenu = window.location.pathname.includes('/henu/');
        const phrases = isHenu ? henuPhrases : myPhrases;

        let pi = 0, ci = 0, deleting = false;

        function type() {
            const phrase = phrases[pi];
            if (deleting) {
                el.textContent = phrase.substring(0, ci - 1);
                ci--;
            } else {
                el.textContent = phrase.substring(0, ci + 1);
                ci++;
            }

            let delay = deleting ? 35 : 70;

            if (!deleting && ci === phrase.length) {
                // Single phrase: hold longer, then restart
                if (phrases.length === 1) {
                    delay = 5000;
                    deleting = true;
                } else {
                    delay = 2200;
                    deleting = true;
                }
            } else if (deleting && ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                delay = 400;
            }

            setTimeout(type, delay);
        }

        setTimeout(type, 800);
    }

    // ============================================
    // Resize handler
    // ============================================
    window.addEventListener('resize', function() {
        resizePCanvas();
        resizeMCanvas();
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = new Array(columns).fill(1);
        initParticles();
    });

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', initTyping);

})();
