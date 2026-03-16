// ============================================
// AR4CHNE Teaser — Cursor Silk Trail (PC only)
// Canvas 2D overlay for mouse trail effect
// ============================================

export function initCursorTrail() {
  // Only activate on devices with hover capability (no touch)
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.innerWidth < 768) return;

  const canvas = document.getElementById('cursor-trail');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  // Trail point storage
  const maxPoints = 50;
  const points = [];
  const trailLifetime = 500; // ms

  let mouseX = -100;
  let mouseY = -100;
  let lastX = -100;
  let lastY = -100;
  let isMoving = false;
  let moveTimeout;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - lastX;
    const dy = mouseY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only add points when mouse moves a minimum distance
    if (dist > 3) {
      points.push({
        x: mouseX,
        y: mouseY,
        time: performance.now(),
      });

      // Cap the array
      if (points.length > maxPoints) {
        points.shift();
      }

      lastX = mouseX;
      lastY = mouseY;
    }

    isMoving = true;
    clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 100);
  }

  window.addEventListener('mousemove', onMouseMove);

  // Animation loop
  let rafId = null;
  function draw() {
    rafId = requestAnimationFrame(draw);

    // Clear canvas
    ctx.clearRect(
      0,
      0,
      canvas.width / window.devicePixelRatio,
      canvas.height / window.devicePixelRatio
    );

    const now = performance.now();

    // Remove expired points
    while (points.length > 0 && now - points[0].time > trailLifetime) {
      points.shift();
    }

    if (points.length < 2) return;

    // Draw smooth bezier trail
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // Connect to last point
    const lastPt = points[points.length - 1];
    ctx.lineTo(lastPt.x, lastPt.y);

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Draw fading segments with varying opacity
    for (let i = 0; i < points.length; i++) {
      const age = now - points[i].time;
      const alpha = Math.max(0, 1 - age / trailLifetime) * 0.15;

      if (alpha <= 0) continue;

      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.fill();
    }

    // Draw a small glow at cursor position when moving
    if (isMoving) {
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 20);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  draw();

  // --- Cleanup ---
  return function dispose() {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMouseMove);
    clearTimeout(moveTimeout);
  };
}
