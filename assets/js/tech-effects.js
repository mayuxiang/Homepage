// Tech Effects for Yuxiang MA's Homepage
// Particle Constellation + Matrix Rain + Typing Effect
(function() {
    'use strict';

    // ============================================
    // 1. Particle Constellation Background
    // ============================================
    const particleCanvas = document.createElement('canvas');
    particleCanvas.id = 'particle-canvas';
    document.body.prepend(particleCanvas);

    const pCtx = particleCanvas.getContext('2d');
    let particles = [];

    function resizeParticleCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeParticleCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 1.5 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = particleCanvas.width;
            if (this.x > particleCanvas.width) this.x = 0;
            if (this.y < 0) this.y = particleCanvas.height;
            if (this.y > particleCanvas.height) this.y = 0;
        }
        draw() {
            pCtx.beginPath();
            pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            pCtx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
            pCtx.fill();
        }
    }

    function initParticles() {
        const n = Math.min(60, Math.floor((particleCanvas.width * particleCanvas.height) / 20000));
        particles = [];
        for (let i = 0; i < n; i++) particles.push(new Particle());
    }

    function drawConnections() {
        const maxD = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxD) {
                    pCtx.beginPath();
                    pCtx.moveTo(particles[i].x, particles[i].y);
                    pCtx.lineTo(particles[j].x, particles[j].y);
                    pCtx.strokeStyle = `rgba(0, 180, 216, ${(1 - d / maxD) * 0.12})`;
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
    // 2. Matrix Rain (subtle, background)
    // ============================================
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.id = 'matrix-canvas';
    document.body.prepend(matrixCanvas);

    const mCtx = matrixCanvas.getContext('2d');

    function resizeMatrixCanvas() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    }
    resizeMatrixCanvas();

    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*(){}[]|;:<>?/~`';
    const fontSize = 14;
    let columns = Math.floor(matrixCanvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        mCtx.font = fontSize + 'px JetBrains Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
            const ch = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            mCtx.fillStyle = `rgba(0, 180, 216, ${Math.random() * 0.3 + 0.1})`;
            mCtx.fillText(ch, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 60);

    // Handle resize
    window.addEventListener('resize', function() {
        resizeParticleCanvas();
        resizeMatrixCanvas();
        columns = Math.floor(matrixCanvas.width / fontSize);
        drops = new Array(columns).fill(1);
        initParticles();
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', function() {
        // Matrix uses setInterval, no need to pause manually
    });

    // ============================================
    // 3. Typing Effect (in about section)
    // ============================================
    const typingPhrases = [
        'Network Security & Privacy',
        'Trustworthy Machine Learning',
        'Mobile Computing',
        'Intelligent Networked Systems'
    ];

    function initTypingEffect() {
        // Find the Research Interests heading and add typing below it
        const headings = document.querySelectorAll('.page__content h2');
        let targetH2 = null;
        headings.forEach(h => {
            if (h.textContent.trim().includes('Research Interests')) {
                targetH2 = h;
            }
        });

        if (!targetH2) return;

        // Create typing element
        const typingDiv = document.createElement('div');
        typingDiv.style.cssText = 'margin: 8px 0 15px 0; font-size: 0.95em;';
        typingDiv.innerHTML = '<span id="typing-text"></span><span class="typing-cursor"></span>';
        targetH2.insertAdjacentElement('afterend', typingDiv);

        let phraseIdx = 0, charIdx = 0, isDeleting = false;

        function type() {
            const el = document.getElementById('typing-text');
            if (!el) return;
            const phrase = typingPhrases[phraseIdx];

            if (isDeleting) {
                el.textContent = phrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                el.textContent = phrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let delay = isDeleting ? 40 : 80;

            if (!isDeleting && charIdx === phrase.length) {
                delay = 2500;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % typingPhrases.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }

        setTimeout(type, 1000);
    }

    document.addEventListener('DOMContentLoaded', initTypingEffect);

})();
