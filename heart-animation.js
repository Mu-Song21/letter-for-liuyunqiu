/**
 * 网页版「线条爱心」——从 Pygame 脚本移植的 Canvas 动画
 * 点开信封后播放约两圈，再回调显示信件。
 */
(function (global) {
  const STARRY_BLACK = '#0a0514';
  const PINK_GLOW = [255, 180, 220];
  const STAR_COLOR = [255, 220, 240];
  const TRAIL_COLOR = [255, 200, 230];
  const MAINTAIN_COLOR = [255, 160, 210];

  const HEART_SAMPLE_POINTS = 360;
  const HEART_SPEED = 2.5;
  const HEAD_LENGTH = 25;
  const STAR_CONVERT_FRAME = 120;
  const STAR_BLINK_INTERVAL = 5;
  const DIFFUSE_SPEED_SCALE = 0.8;
  const BASE_RADIUS = 1.5;
  const MAX_RADIUS = 3.0;
  const PULSE_PERIOD = 30;
  const MAX_PARTICLE_LIFETIME = 540;
  const PARTICLE_SPAWN_RATE = 2;
  const MAINTAIN_PROBABILITY = 0.3;
  const MAINTAIN_DISTURB = 0.3;
  const MAX_HEART_TRAIL_LENGTH = 360 * 3;
  const TRAIL_FADE_FACTOR = 0.85;
  const TARGET_LOOPS = 1; // 一圈后交给后续阶段（照片心 / 弹窗）

  function getHeartPoint(tAngle, scale, cx, cy) {
    const rad = (tAngle * Math.PI) / 180;
    let x = 14 * Math.pow(Math.sin(rad), 3);
    let y = -(
      12 * Math.cos(rad) -
      4 * Math.cos(2 * rad) -
      1.5 * Math.cos(3 * rad) -
      0.8 * Math.cos(4 * rad)
    );
    const smooth = 0.3;
    x = x * (1 - smooth) + 10 * Math.sin(rad) * smooth;
    y = y * (1 - smooth) + -10 * Math.cos(rad) * smooth;
    return [cx + x * scale, cy + y * scale];
  }

  function getHeartTangent(tAngle) {
    const rad = (tAngle * Math.PI) / 180;
    let dx =
      14 * 3 * Math.pow(Math.sin(rad), 2) * Math.cos(rad);
    let dy =
      12 * Math.sin(rad) -
      8 * Math.sin(2 * rad) -
      4.5 * Math.sin(3 * rad) -
      3.2 * Math.sin(4 * rad);
    const smooth = 0.3;
    dx = dx * (1 - smooth) + 10 * Math.cos(rad) * smooth;
    dy = dy * (1 - smooth) + 10 * Math.sin(rad) * smooth;
    const len = Math.hypot(dx, dy) || 1;
    return [dx / len, dy / len];
  }

  class HeartParticle {
    constructor(x, y, angle) {
      this.lifetime = 0;
      this.maxLifetime = MAX_PARTICLE_LIFETIME;
      this.spawnAngle = angle;
      this.isMaintaining = Math.random() < MAINTAIN_PROBABILITY;
      this.isStar = false;
      this.trail = [[x, y]];
      this.basePos = [x, y];
      this.blinkTimer = 0;
      this.blinkState = true;
      this.pulseTimer = 0;
      this.baseRadius = BASE_RADIUS;
      this.maxRadius = MAX_RADIUS;

      if (this.isMaintaining) {
        this.vx = (Math.random() * 2 - 1) * MAINTAIN_DISTURB;
        this.vy = (Math.random() * 2 - 1) * MAINTAIN_DISTURB;
        this.drag = 0.98;
      } else {
        const [tx, ty] = getHeartTangent(angle);
        const speed = 2.0 * (0.9 + Math.random() * 0.2);
        this.vx = -tx * speed;
        this.vy = -ty * speed;
        const a = (Math.random() * 0.4 - 0.2);
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const nvx = this.vx * cos - this.vy * sin;
        const nvy = this.vx * sin + this.vy * cos;
        this.vx = nvx;
        this.vy = nvy;
        this.drag = 0.998;
      }
    }

    update() {
      if (!this.isStar && this.lifetime >= STAR_CONVERT_FRAME) {
        this.isStar = true;
        if (!this.isMaintaining) {
          this.vx *= DIFFUSE_SPEED_SCALE;
          this.vy *= DIFFUSE_SPEED_SCALE;
        }
      }

      if (this.isMaintaining) {
        this.vx += Math.random() * 0.1 - 0.05;
        this.vy += Math.random() * 0.1 - 0.05;
        this.vx *= this.drag;
        this.vy *= this.drag;
        const last = this.trail[this.trail.length - 1];
        if (Math.abs(last[0] - this.basePos[0]) > 5) this.vx *= -0.5;
        if (Math.abs(last[1] - this.basePos[1]) > 5) this.vy *= -0.5;
      } else {
        this.vx *= this.drag;
        this.vy *= this.drag;
      }

      const last = this.trail[this.trail.length - 1];
      this.trail.push([last[0] + this.vx, last[1] + this.vy]);
      if (this.trail.length > 80) this.trail.shift();

      if (this.isStar) {
        this.blinkTimer += 1;
        if (this.blinkTimer >= STAR_BLINK_INTERVAL) {
          this.blinkState = !this.blinkState;
          this.blinkTimer = 0;
        }
      }

      this.pulseTimer = (this.pulseTimer + 1) % PULSE_PERIOD;
      this.lifetime += 1;
    }

    getCurrentRadius() {
      const pulse = Math.abs(
        Math.sin((this.pulseTimer * 2 * Math.PI) / PULSE_PERIOD)
      );
      return this.baseRadius + (this.maxRadius - this.baseRadius) * pulse;
    }

    isDead() {
      return this.lifetime >= this.maxLifetime;
    }

    getDecay() {
      return 1.0 - Math.pow(this.lifetime / this.maxLifetime, 1.2);
    }

    getStarAlpha() {
      return this.blinkState ? 0.86 : 0.31;
    }
  }

  function rgba(rgb, a) {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
  }

  class HeartLineAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.running = false;
      this.rafId = null;
      this.onComplete = null;
      this.resetState();
    }

    resetState() {
      this.particles = [];
      this.tAngle = 0;
      this.headHistory = [];
      this.heartTrail = [];
      this.framesElapsed = 0;
      this.loopsCompleted = 0;
      this.firstLoopComplete = false;
      this.finished = false;
      this._endingScheduled = false;
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = w;
      this.height = h;
      this.cx = w / 2;
      this.cy = h / 2;
      // 心形更大、更醒目（接近原版 Pygame 观感）
      this.scale = Math.min(w, h) / 36;
    }

    start(onComplete) {
      this.stop();
      this.resetState();
      this.onComplete = onComplete;
      this.resize();
      this.running = true;
      this.loop();
    }

    stop() {
      this.running = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this._endTimer) {
        clearTimeout(this._endTimer);
        this._endTimer = null;
      }
    }

    finish() {
      if (this.finished) return;
      this.finished = true;
      this.stop();
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }

    loop = () => {
      if (!this.running) return;
      this.update();
      this.draw();
      this.rafId = requestAnimationFrame(this.loop);
    };

    update() {
      const tOld = this.tAngle;
      this.tAngle = (this.tAngle + HEART_SPEED) % HEART_SAMPLE_POINTS;
      const pos = getHeartPoint(this.tAngle, this.scale, this.cx, this.cy);
      this.framesElapsed += 1;

      this.heartTrail.push(pos);
      if (this.heartTrail.length > MAX_HEART_TRAIL_LENGTH) {
        this.heartTrail.shift();
      }

      if (!this.firstLoopComplete) {
        if (this.tAngle < tOld && this.framesElapsed > 60) {
          this.firstLoopComplete = true;
          this.loopsCompleted = 1;
          if (TARGET_LOOPS <= 1 && !this._endingScheduled) {
            this._endingScheduled = true;
            this._endTimer = setTimeout(() => this.finish(), 900);
          }
        }
      } else if (this.tAngle < tOld) {
        this.loopsCompleted += 1;
        if (this.loopsCompleted >= TARGET_LOOPS && !this._endingScheduled) {
          this._endingScheduled = true;
          this._endTimer = setTimeout(() => this.finish(), 900);
        }
      }

      this.headHistory.unshift({ pos, angle: this.tAngle });
      if (this.headHistory.length > HEAD_LENGTH) this.headHistory.pop();

      for (let i = 0; i < PARTICLE_SPAWN_RATE; i++) {
        this.particles.push(new HeartParticle(pos[0], pos[1], this.tAngle));
      }

      this.particles = this.particles.filter((p) => {
        p.update();
        return !p.isDead();
      });

      // 控制粒子数量，避免手机卡顿
      if (this.particles.length > 900) {
        this.particles.splice(0, this.particles.length - 900);
      }
    }

    draw() {
      const ctx = this.ctx;
      const { width: w, height: h } = this;

      ctx.fillStyle = STARRY_BLACK;
      ctx.fillRect(0, 0, w, h);

      // 心形轨迹
      const trail = this.heartTrail;
      if (trail.length > 1) {
        const n = trail.length;
        for (let i = 0; i < n - 1; i++) {
          let alpha;
          if (i > n - 100) alpha = 0.4;
          else alpha = 0.4 * Math.pow(TRAIL_FADE_FACTOR, n - 100 - i);
          if (alpha < 0.02) continue;
          ctx.strokeStyle = rgba(TRAIL_COLOR, alpha);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(trail[i][0], trail[i][1]);
          ctx.lineTo(trail[i + 1][0], trail[i + 1][1]);
          ctx.stroke();
        }
      }

      // 粒子拖尾与核心
      for (const p of this.particles) {
        const decay = p.getDecay();
        if (p.trail.length > 2) {
          const color = p.isMaintaining ? MAINTAIN_COLOR : [
            Math.floor(255 * decay),
            Math.floor(180 * decay),
            Math.floor(220 * decay),
          ];
          const len = p.isMaintaining
            ? Math.min(p.trail.length, 50)
            : p.trail.length;
          const slice = p.trail.slice(-len);
          ctx.strokeStyle = rgba(color, 0.86 * Math.pow(decay, 0.8));
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(slice[0][0], slice[0][1]);
          for (let i = 1; i < slice.length; i++) {
            ctx.lineTo(slice[i][0], slice[i][1]);
          }
          ctx.stroke();
        }

        const last = p.trail[p.trail.length - 1];
        const r = p.getCurrentRadius();
        const core = p.isMaintaining ? MAINTAIN_COLOR : PINK_GLOW;
        const alpha = p.isStar ? p.getStarAlpha() * decay : 0.86 * decay;
        ctx.fillStyle = rgba(p.isStar ? STAR_COLOR : core, alpha);
        ctx.beginPath();
        ctx.arc(last[0], last[1], r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 蛇形光线
      const head = this.headHistory;
      if (head.length > 1) {
        for (let i = 0; i < head.length - 1; i++) {
          const g = 1 - i / head.length;
          const lw = Math.max(1, Math.floor(12 * g));
          ctx.strokeStyle = rgba(PINK_GLOW, g);
          ctx.lineWidth = lw;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(head[i].pos[0], head[i].pos[1]);
          ctx.lineTo(head[i + 1].pos[0], head[i + 1].pos[1]);
          ctx.stroke();
          if (lw > 2) {
            ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, g + 0.12)})`;
            ctx.lineWidth = Math.max(1, Math.floor(lw / 2));
            ctx.beginPath();
            ctx.moveTo(head[i].pos[0], head[i].pos[1]);
            ctx.lineTo(head[i + 1].pos[0], head[i + 1].pos[1]);
            ctx.stroke();
          }
        }
      }
    }
  }

  global.HeartLineAnimation = HeartLineAnimation;
})(window);
