/**
 * 轻量版漂浮光点背景（参考 Awesome-Love-Code Web/023 的粒子氛围）
 */
(function () {
  const canvas = document.getElementById('bgParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let dpr = 1;
  const particles = [];
  const COUNT = window.matchMedia('(max-width: 768px)').matches ? 28 : 70;
  const mouse = { x: 0.5, y: 0.5 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 4 + Math.random() * 14,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a: 0.15 + Math.random() * 0.35,
        filled: Math.random() > 0.65,
        hue: 330 + Math.random() * 35,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);

    const mx = mouse.x * w;
    const my = mouse.y * h;

    for (const p of particles) {
      // 轻微被鼠标吸引
      p.vx += (mx - p.x) * 0.00002;
      p.vy += (my - p.y) * 0.00002;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;
      if (p.y < -40) p.y = h + 40;
      if (p.y > h + 40) p.y = -40;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      if (p.filled) {
        ctx.fillStyle = `hsla(${p.hue}, 70%, 85%, ${p.a})`;
        ctx.fill();
      } else {
        ctx.strokeStyle = `hsla(${p.hue}, 60%, 88%, ${p.a + 0.1})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    resize();
    spawn();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  });

  resize();
  spawn();
  tick();
})();
