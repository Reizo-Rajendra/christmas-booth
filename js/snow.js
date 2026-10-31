// ============================================================================
// Cinematic Christmas Snowfall & Sparkle Particle Engine
// 3D Parallax layers + Wind physics + Interactive Swirl
// ============================================================================

class SnowEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.flakes = [];
    this.numFlakes = 140;
    this.wind = 0.2;
    this.targetWind = 0.2;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseActive = false;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Interactive mouse wind
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      const normalizedX = (e.clientX / window.innerWidth) - 0.5;
      this.targetWind = normalizedX * 1.5;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;
        const normalizedX = (e.touches[0].clientX / window.innerWidth) - 0.5;
        this.targetWind = normalizedX * 1.5;
      }
    });

    // Create flakes across 3 depth planes
    this.flakes = [];
    for (let i = 0; i < this.numFlakes; i++) {
      this.flakes.push(this.createFlake(true));
    }

    this.start();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createFlake(randomY = false) {
    // 3 depth layers: 0 (deep background), 1 (midground), 2 (crisp foreground)
    const layer = Math.random() < 0.2 ? 2 : Math.random() < 0.5 ? 1 : 0;
    let radius, speed, opacity, blur;

    if (layer === 2) { // Foreground
      radius = 3.5 + Math.random() * 2.5;
      speed = 1.6 + Math.random() * 1.2;
      opacity = 0.8 + Math.random() * 0.2;
      blur = 2;
    } else if (layer === 1) { // Midground
      radius = 2.0 + Math.random() * 1.5;
      speed = 0.9 + Math.random() * 0.8;
      opacity = 0.5 + Math.random() * 0.3;
      blur = 0;
    } else { // Background
      radius = 0.8 + Math.random() * 1.2;
      speed = 0.4 + Math.random() * 0.4;
      opacity = 0.2 + Math.random() * 0.3;
      blur = 0;
    }

    return {
      x: Math.random() * (this.width || window.innerWidth),
      y: randomY ? Math.random() * (this.height || window.innerHeight) : -15,
      radius,
      layer,
      speed,
      opacity,
      blur,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
      wobbleRadius: 0.5 + Math.random() * 1.2,
      sparkle: Math.random() < 0.15,
      sparklePhase: Math.random() * Math.PI * 2
    };
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const render = () => {
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    render();
  }

  update() {
    // Smooth wind easing
    this.wind += (this.targetWind - this.wind) * 0.03;

    for (let i = 0; i < this.flakes.length; i++) {
      const f = this.flakes[i];
      f.wobble += f.wobbleSpeed;
      f.y += f.speed;
      f.x += Math.sin(f.wobble) * f.wobbleRadius + this.wind * (f.layer + 1) * 0.6;

      // Mouse deflection
      const dx = f.x - this.mouseX;
      const dy = f.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        f.x += (dx / dist) * force * 2;
        f.y += (dy / dist) * force * 1.5;
      }

      // Reset flake when it falls below bottom
      if (f.y > this.height + 15 || f.x < -20 || f.x > this.width + 20) {
        this.flakes[i] = this.createFlake(false);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.flakes.length; i++) {
      const f = this.flakes[i];
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);

      let alpha = f.opacity;
      if (f.sparkle) {
        f.sparklePhase += 0.08;
        alpha *= 0.6 + 0.4 * Math.sin(f.sparklePhase);
      }

      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      if (f.blur > 0) {
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.ctx.shadowBlur = f.blur * 2;
      }
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}

window.SnowEngine = SnowEngine;
